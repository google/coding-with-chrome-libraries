/**
 * @fileoverview Handles the pairing and communication of Bluetooth Web devices.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
goog.module('cwc.lib.protocol.bluetoothWeb.Devices');

const BluetoothDevice = goog.require('cwc.lib.protocol.bluetoothWeb.Device');
const BluetoothDeviceProfile =
  goog.require('cwc.lib.protocol.bluetoothWeb.profile.Device');
const Logger = goog.require('cwc.lib.utils.log.Logger');


/**
 * @class
 */
class Devices {
  /**
   * @param {!goog.events.EventTarget} eventTarget
   */
  constructor(eventTarget) {
    /** @type {string} */
    this.name = 'Bluetooth Web Devices';

    /** @type {Object} */
    this.devices = {};

    /** @type {boolean} */
    this.prepared = false;

    /** @private {Object} */
    this.deviceTypeMap_ = {};

    /** @private {!goog.events.EventTarget} */
    this.eventTarget_ = eventTarget;

    /** @private {!cwc.lib.utils.Logger} */
    this.log_ = new Logger(this.name);
  }

  /**
   *
   */
  prepare() {
    if (this.prepared) {
      return;
    }

    this.log_.debug('Preparing Bluetooth LE devices ...');
    this.prepared = true;
  }


  /**
   * @param {!cwc.lib.protocol.bluetoothWeb.profile.Device} deviceProfile
   * @return {Promise}
   */
  requestDevice(deviceProfile) {
    let filter = this.getDeviceFilter_(deviceProfile);
    this.log_.info('Request device with filter', filter);
    return new Promise((resolve, reject) => {
      navigator.bluetooth.requestDevice(filter).then((bluetoothDevice) => {
        try {
          resolve(this.handleRequestDevice_(bluetoothDevice, deviceProfile));
        } catch (error) {
          reject(error);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }


  /**
   * @return {Promise}
   */
  requestDevices() {
    let filter = this.getDevicesFilter_();
    this.log_.info('Searching for devices with filter', filter);
    return new Promise((resolve, reject) => {
      navigator.bluetooth.requestDevice(filter).then((bluetoothDevice) => {
        try {
          resolve(this.handleRequestDevice_(bluetoothDevice));
        } catch (error) {
          reject(error);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }


  /**
   * Get device filter for an single device.
   * @param {!cwc.lib.protocol.bluetoothWeb.profile.Device} device
   * @return {!Object}
   */
  getDeviceFilter_(device) {
    // Get supported GATT services.
    let services = Object.keys(device.service).map(
      (service) => device.service[service]._id_
    );
    if (!services) {
      this.log_.error('Unable to find any service for device', device);
    }
    if (device.namePrefix) {
      return {
        'filters': [
          {'namePrefix': device.namePrefix},
          {'services': services},
        ],
      };
    } else {
      return {
        'filters': [{
          'services': services,
        }],
      };
    }
  }

  /**
   * Get device filter for all known devices.
   * @return {Object}
   * @private
   */
  getDevicesFilter_() {
    let filters = [];
    let services = [];
    for (let device of BluetoothDeviceProfile.LIST) {
      filters.push({'namePrefix': device.namePrefix});
      services = [...new Set(
        [...services, ...Object.keys(device.service).map(
          (service) => device.service[service]._id_
      )])];
    }
    return {
      'filters': filters,
      'optionalServices': services,
    };
  }


  /**
   * @param {string} id
   * @return {cwc.protocol.bluetooth.lowEnergy.Device}
   */
  getDevice(id) {
    if (id in this.devices) {
      return this.devices[id];
    }
    this.log_.error('Bluetooth device id', id, 'is unknown!');
    return null;
  }


  /**
   * @param {?} device
   * @return {!BluetoothProfile.Device|null}
   */
   getDeviceProfile(device) {
    let deviceProfile = null;
    for (let profile of BluetoothDeviceProfile.LIST) {
      if (profile &&
          device['name'] == profile.name ||
          device['name'].includes(profile.namePrefix)) {
        this.log_.debug('Found device profile', profile.name, 'for', device);
        deviceProfile = profile;
      }
    }
    if (!deviceProfile) {
      this.log_.error('Unable to find device profile for', device);
    }
    return deviceProfile;
  }


  /**
   * @return {Object}
   */
  getDevices() {
    return this.devices;
  }


  /**
   * @param {string} name
   * @return {Array.<cwc.protocol.bluetooth.lowEnergy.Device>}
   */
  getDevicesByName(name) {
    if (name in this.deviceTypeMap_) {
      return this.deviceTypeMap_[name];
    }
    return null;
  }


  /**
   * @param {?} bluetoothDevice
   * @param {cwc.lib.protocol.bluetoothWeb.profile.Device=} profile
   * @return {cwc.protocol.bluetooth.lowEnergy.Device}
   * @private
   */
  handleRequestDevice_(bluetoothDevice, profile) {
    let deviceProfile = profile ?
      profile : this.getDeviceProfile(bluetoothDevice) || {};
    let deviceId = bluetoothDevice['id'];
    let deviceName = bluetoothDevice['name'];
    let device = new BluetoothDevice()
      .setConnected(bluetoothDevice['gatt']['connected'])
      .setDevice(bluetoothDevice)
      .setExternalEventTarget(this.eventTarget_)
      .setId(deviceId)
      .setLogName('Bluetooth LE Device ' + deviceId)
      .setName(deviceName)
      .setProfile(deviceProfile);
    this.devices[deviceId] = device;

    // Storing device in type map for easy access.
    if (deviceProfile) {
      if (!(deviceProfile.name in this.deviceTypeMap_)) {
        this.deviceTypeMap_[deviceProfile.name] = [];
      }
      this.deviceTypeMap_[deviceProfile.name].push(device);
    }
    this.log_.info('Found requested device', this.devices[deviceId]);
    return this.devices[deviceId];
  }
}


exports = Devices;
