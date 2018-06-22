/**
 * @fileoverview Handels the pairing and communication with Bluetooth devices.
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
goog.module('cwc.lib.protocol.bluetoothChrome.Api');

const Adapter = goog.require('cwc.lib.protocol.bluetoothChrome.Adapter');
const BluetoothDevices =
  goog.require('cwc.lib.protocol.bluetoothChrome.Devices');
const EventTarget = goog.require('goog.events.EventTarget');
const Events = goog.require('cwc.lib.protocol.bluetoothChrome.Events');
const Logger = goog.require('cwc.lib.utils.Logger');


/**
 * @class
 */
class Api {
  /**
   *
   */
  constructor() {
    /** @type {string} */
    this.name = 'Bluetooth';

    /** @type {boolean} */
    this.enabled = false;

    /** @type {boolean} */
    this.prepared = false;

    /** @type {Object} */
    this.connectionIds = {};

    /** @private {!goog.events.EventTarget} */
    this.eventHandler_ = new EventTarget();

    /** @private {!cwc.protocol.bluetooth.classic.Adapter} */
    this.adapter_ = new Adapter(this.eventHandler_);

    /** @private {!cwc.lib.protocol.bluetoothChrome.Devices} */
    this.devices_ = new BluetoothDevices(this.eventHandler_);

    /** @private {!cwc.lib.utils.Logger} */
    this.log_ = new Logger(this.name);
  }


  /**
   * Prepares the bluetooth api and monitors Bluetooth adapter.
   */
  prepare() {
    if (!chrome.bluetooth) {
      console.warn('Chrome Bluetooth support is not available!');
      return;
    } else if (this.prepared) {
      return;
    }

    this.log_.debug('Preparing Chrome Bluetooth support...');

    // Monitor Bluetooth adapter
    goog.events.listen(this.eventHandler_,
      Events.Type.ADAPTER_STATE_CHANGE,
      this.updateDevices, false, this);
    this.adapter_.prepare();

    // Monitor Bluetooth devices
    this.devices_.prepare();

    // Monitor Bluetooth sockets
    chrome.bluetoothSocket.onReceive.addListener(
      this.handleOnReceive_.bind(this));
    chrome.bluetoothSocket.onReceiveError.addListener(
      this.handleOnReceiveError_.bind(this));

    this.prepared = true;
  }

  /**
   * Update devices.
   */
  updateDevices() {
    this.devices_.updateDevices();
  }


  /**
   * @param {string} address
   * @return {cwc.lib.protocol.bluetoothChrome.Device}
   */
  getDevice(address) {
    return this.devices_.getDevice(address);
  }


  /**
   * @param {string} name
   * @return {cwc.lib.protocol.bluetoothChrome.Device}
   */
  getDeviceByName(name) {
    return this.devices_.getDeviceByName(name);
  }


  /**
   * @return {Object}
   */
  getDevices() {
    return this.devices_.getDevices();
  }


  /**
   * @return {!goog.events.EventTarget}
   */
  getEventHandler() {
    return this.eventHandler_;
  }


  /**
   * @param {string} deviceName
   * @param {Function} callback
   */
  autoConnectDevice(deviceName, callback) {
    this.devices_.autoConnectDevice(deviceName, callback);
  }


  /**
   * Update Adapter state.
   */
  updateAdapterState() {
    this.adapter_.updateAdapterState();
  }


  /**
   * Close sockets.
   */
  closeSockets() {
    this.devices_.closeSockets();
  }


  /**
   * @param {Object} info
   * @private
   */
  handleOnReceive_(info) {
    this.devices_.receiveData(info['socketId'], info['data']);
  }


  /**
   * @param {Object} info
   * @private
   */
  handleOnReceiveError_(info) {
    this.devices_.receiveError(info['socketId'], info['error']);
  }
}


exports = Api;
