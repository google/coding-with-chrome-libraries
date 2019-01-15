/**
 * @fileoverview Handles the pairing and communication with Bluetooth devices.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.module('cwc.lib.protocol.bluetoothWeb.Device');

const BluetoothEvents = goog.require('cwc.lib.protocol.bluetoothWeb.Events');
const DefaultDevice = goog.require('cwc.lib.protocol.Device');
const StackQueue = goog.require('cwc.lib.utils.Stack');


/**
 * @class
 */
class Device extends DefaultDevice {
  /**
   *
   */
  constructor() {
    super();

    /** @private {!Object} */
    this.server_ = {};

    /** @private {!Object} */
    this.services_ = {};

    /** @private {!Object} */
    this.characteristic_ = {};

    /** @private {!Object} */
    this.characteristicListener_ = {};

    /** @private {!Object} */
    this.device_ = {};

    /** @private {!StackQueue} */
    this.stack_ = new StackQueue.Queue();
  }


  /**
   * @param {!Object} device
   * @return {THIS}
   * @template THIS
   */
  setDevice(device) {
    this.device_ = device;
    return this;
  }


  /**
   * @return {!Promise}
   */
  connect() {
    return new Promise((resolve) => {
      this.connected = this.device_['gatt']['connected'];
      if (this.connected) {
        return resolve(this);
      }
      this.log.info('Connecting...');
      this.device_['gatt']['connect']().then((server) => {
        this.server_ = server;
        this.connected = this.device_['gatt']['connected'];
        this.handleConnect_().then(() => {
          this.log.info('Connected!');
          this.connected = true;
          resolve(this);
        });
      });
    });
  }


  /**
   * Disconencts device
   * @return {boolean}
   */
  disconnect() {
    this.log.info('Diconnecting...');
    if (this.device_['gatt']['connected']) {
      if (this.listener_) {
        this.unlistenAll().then(() => {
          this.device_['gatt']['disconnect']();
        });
      } else {
        this.device_['gatt']['disconnect']();
      }
    }
    return super.disconnect();
  }


  /**
   * Listen to the specific characteristic id.
   * @param {string} characteristicId
   * @param {!Function} func
   */
  listen(characteristicId, func) {
    if (typeof func !== 'function') {
      this.log.error('Invalid listener', func);
      return;
    }
    this.log.info('Adding event listener for', characteristicId);
    if (!this.listener_[characteristicId]) {
      this.characteristicListener_[characteristicId] = (event) => {
        this.handleData_(event, characteristicId);
      };
      this.listener_[characteristicId] = [];
      this.characteristic_[characteristicId]['startNotifications']().then(
        () => {
        this.log.info('Start notifications for', characteristicId);
        this.characteristic_[characteristicId]['addEventListener'](
          'characteristicvaluechanged',
          this.characteristicListener_[characteristicId]);
      });
    }
    this.listener_[characteristicId].push(func);
  }


  /**
   * Remove event listener from the specific characteristic id.
   * @param {string} characteristicId
   * @return {!Promise}
   */
  unlisten(characteristicId) {
    return new Promise((resolve) => {
      this.characteristic_[characteristicId]['stopNotifications']().then(() => {
        this.log.info('Stop notifications for', characteristicId);
        if (this.characteristicListener_[characteristicId]) {
          this.log.info('Remove event listener for', characteristicId);
          this.characteristic_[characteristicId]['removeEventListener'](
            'characteristicvaluechanged',
            this.characteristicListener_[characteristicId]);
          this.characteristicListener_[characteristicId] = null;
        }
        resolve();
      });
      this.listener_[characteristicId] = null;
    });
  }


  /**
   * Removes all known event listener.
   * @return {!Promise}
   */
  unlistenAll() {
    let promises = [];
    for (let characteristic in this.listener_) {
      if (this.listener_.hasOwnProperty(characteristic)) {
        promises.push(this.unlisten(characteristic));
      }
    }
    return Promise.all(promises);
  }


  /**
   * Sends the buffer to the socket and the defined or default characteristic.
   * @param {!ArrayBuffer} buffer
   * @param {string=} characteristicId
   */
  send(buffer, characteristicId = this.defaultCharacteristic_) {
    this.stack_.addPromise(() => {
      return this.characteristic_[characteristicId]['writeValue'](buffer);
    });
  }


  /**
   * Sends the buffer to the socket.
   * @param {!Array|!ArrayBuffer|!Uint8Array} buffer
   * @param {string} characteristicId
   * @param {?Function=} callback
   */
  sendRaw(buffer, characteristicId, callback) {
    this.stack_.addPromise(() => {
      return this.characteristic_[characteristicId]['writeValue'](buffer);
    }, callback);
  }


  /**
   * Sends the buffer to the specific characteristic and descriptor.
   * @param {!Array|!ArrayBuffer|!Uint8Array} buffer
   * @param {string} characteristicId
   * @param {string} descriptorId
   * @param {?Function=} callback
   */
  sendDescriptor(buffer, characteristicId, descriptorId, callback) {
    this.stack_.addPromise(() => {
      return this.characteristic_[characteristicId]['getDescriptor'](
        descriptorId).then((descriptor) => {
          return descriptor['writeValue'](buffer);
        });
    }, callback);
  }


  /**
   * Clears stacks queue.
   */
  reset() {
    this.stack_.clear();
  }


  /**
   * @return {string}
   */
  getAddress() {
    console.warn('Bluetooth Web devices are not using addresses.');
    return this.id || '';
  }


  /**
   * @param {string} characteristicId
   * @return {?Object}
   */
  getCharacteristic(characteristicId) {
    if (!this.characteristic_[characteristicId]) {
      this.log.error('Unknown characteristic', characteristicId);
      this.log.error('Please make sure it\'s listed in the device profile!');
      return null;
    }
    return this.characteristic_[characteristicId];
  }


  /**
   * Handles connect and pre-connect available services.
   * @return {!Promise}
   * @private
   */
  handleConnect_() {
    let promises = [];
    // Pre-connect available services and characteristics.
    for (let service in this.profile.service) {
      if (this.profile.service.hasOwnProperty(service)) {
        let serviceEntry = this.profile.service[service];
        let serviceId = serviceEntry._id_;
        let characteristics = (Object.keys(serviceEntry).map(
          (characteristic) => serviceEntry[characteristic]
        )).filter((id) => id !== serviceId);
        promises.push(this.connectService_(serviceId, characteristics));
      }
    }
    if (!this.prepared) {
      this.device_['addEventListener']('gattserverdisconnected',
        this.handleDisconnect_.bind(this));
      this.prepared = true;
    }
    this.eventTarget.dispatchEvent(
      BluetoothEvents.deviceState({connected: true}));
    this.externalEventTarget.dispatchEvent(
      BluetoothEvents.deviceState({connected: true}));
    return Promise.all(promises);
  }


  /**
   * Handles disconnect.
   * @param {?} event
   * @private
   */
  handleDisconnect_(event) {
    console.log('Disconnected!', event);
    this.connected = false;
    this.device_['removeEventListener']('gattserverdisconnected',
      this.handleDisconnect_.bind(this));
    this.eventTarget.dispatchEvent(
      BluetoothEvents.deviceState({connected: false}));
    this.externalEventTarget.dispatchEvent(
      BluetoothEvents.deviceState({connected: false}));
  }


  /**
   * Handles connected service and pre-connect available characteristic.
   * @param {string} serviceId
   * @param {?Array=} characteristics
   * @return {!Promise}
   * @private
   */
  connectService_(serviceId, characteristics) {
    this.log.info('Connect service', serviceId);
    return this.server_['getPrimaryService'](serviceId).then((service) => {
      return this.handleConnectService_(service, characteristics);
    });
  }


  /**
   * @param {?} service
   * @param {?Array=} characteristics
   * @return {!Promise}
   * @private
   */
  handleConnectService_(service, characteristics) {
    let serviceId = service['uuid'];
    this.services_[serviceId] = service;
    if (!characteristics) {
      return Promise.resolve();
    }

    // Preconnecting characteristic.
    let promises = [];
    this.log.info('Pre-connecting', characteristics.length, 'characteristics',
      'on service', serviceId);
    for (const characteristic of characteristics) {
      promises.push(this.connectCharacteristic_(characteristic, serviceId));
    }
    return Promise.all(promises);
  }


  /**
   * @param {string} characteristicId
   * @param {string} serviceId
   * @return {!Promise}
   * @private
   */
  connectCharacteristic_(characteristicId, serviceId) {
    this.log.info('Connecting characteristic', characteristicId, 'on service',
      serviceId);
    return this.services_[serviceId]['getCharacteristic'](
      characteristicId).then((characteristic) => {
        this.characteristic_[characteristicId] = characteristic;
    });
  }


  /**
   * @param {?} event
   * @param {string} characteristicId
   */
  handleData_(event, characteristicId) {
    let data = event.target.value.buffer;
    if (!data) {
      return;
    }
    if (this.listener_[characteristicId]) {
      for (let eventHandler of this.listener_[characteristicId]) {
        eventHandler(data);
      }
    }
  }
}


exports = Device;
