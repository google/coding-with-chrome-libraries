/**
 * @fileoverview Handels the pairing and communication with Bluetooth devices.
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
goog.module('cwc.lib.protocol.bluetoothWeb.Api');

const BluetoothDevices = goog.require('cwc.lib.protocol.bluetoothWeb.Devices');
const Logger = goog.require('cwc.lib.utils.log.Logger');


/**
 * @class
 */
class Api {
  /**
   *
   */
  constructor() {
    /** @type {string} */
    this.name = 'Bluetooth Web';

    /** @type {boolean} */
    this.enabled = false;

    /** @type {boolean} */
    this.prepared = false;

    /** @private {cwc.lib.protocol.bluetoothWeb.Devices} */
    this.devices_ = new BluetoothDevices();

    /** @private {!cwc.utils.Logger} */
    this.log_ = new Logger(this.name);
  }


  /**
   * Prepares the bluetooth le api and monitors Bluetooth adapter.
   */
  prepare() {
    if (this.prepared) {
      return;
    }

    this.log_.debug('Preparing Bluetooth LowEnergy support...');
    this.devices_.prepare();

    this.prepared = true;
  }


  /**
   * @param {!cwc.protocol.bluetooth.lowEnergy.supportedDevices} device
   * @return {Promise}
   */
  requestDevice(device) {
    return this.devices_.requestDevice(device);
  }


  /**
   * @param {Function=} callback Will be only called  after an connection.
   */
  requestDevices(callback) {
    this.devices_.requestDevices(callback);
  }


  /**
   * @param {string} id
   * @return {cwc.protocol.bluetooth.lowEnergy.Device}
   */
  getDevice(id) {
    return this.devices_.getDevice(id);
  }


  /**
   * @return {Object}
   */
  getDevices() {
    return this.devices_.getDevices();
  }


  /**
   * @param {string} name
   * @return {Object}
   */
  getDevicesByName(name) {
    return this.devices_.getDevicesByName(name);
  }
}

exports = Api;
