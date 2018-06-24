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
const BluetoothProfile = goog.require('cwc.lib.protocol.bluetoothWeb.Profile');
const Logger = goog.require('cwc.lib.utils.Logger');


/**
 * @class
 */
class Devices {
  /**
   *
   */
  constructor() {
    /** @type {string} */
    this.name = 'Bluetooth Web Devices';

    /** @type {Object} */
    this.devices = {};

    /** @type {boolean} */
    this.prepared = false;

    /** @private {Object} */
    this.deviceTypeMap_ = {};

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
   * @param {!BluetoothProfile.Device} device
   * @return {Promise}
   */
  requestDevice(device) {
    let services = Object.keys(device.services).map(
      (service) => device.services[service]
    );
    return new Promise((resolve, reject) => {
      navigator.bluetooth.requestDevice({
        'filters': [
          {'namePrefix': device.namePrefix},
        ],
        'optionalServices': services,
      }).then((bluetoothDevice) => {
        resolve(this.handleRequestDevice_(bluetoothDevice));
      }).catch(() => reject);
    });
  }


  /**
   * @param {Function=} callback Will be only called  after an connection.
   */
  requestDevices(callback) {
    let filter = this.getDeviceFilter_();
    this.log_.info('Searching for devices with filter', filter);
    navigator.bluetooth.requestDevice(filter).then((bluetoothDevice) => {
      this.handleRequestDevice_(bluetoothDevice);
      if (callback) {
        callback();
      }
    });
  }


  /**
   * @return {Object}
   * @private
   */
  getDeviceFilter_() {
    let filters = [];
    let services = [];
    for (let entry in BluetoothProfile.Device) {
      if (
        BluetoothProfile.Device.hasOwnProperty(entry)) {
        let device = BluetoothProfile.Device[entry];
        filters.push({'namePrefix': device.namePrefix});
        services = [...new Set(
          [...services, ...Object.keys(device.services).map(
            (service) => device.services[service]
        )])];
      }
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
    for (let entry in BluetoothProfile.Device) {
      if (
        BluetoothProfile.Device.hasOwnProperty(entry)) {
        let profile = BluetoothProfile.Device[entry];
        if (device['name'] == profile.name ||
            device['name'].includes(profile.namePrefix)) {
          this.log_.debug('Found device profile', profile.name, 'for', device);
          return profile;
        }
      }
    }
    return null;
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
   * @return {cwc.protocol.bluetooth.lowEnergy.Device}
   * @private
   */
  handleRequestDevice_(bluetoothDevice) {
    console.log('handleRequestDevice_', bluetoothDevice);
    let profile = this.getDeviceProfile(bluetoothDevice);
    if (!profile) {
      this.log_.warn('Unknown device', bluetoothDevice);
    }

    // Creating device entry.
    let device = new BluetoothDevice()
      .setConnected(bluetoothDevice['gatt']['connected'])
      .setDevice(bluetoothDevice)
      .setId(bluetoothDevice['id'])
      .setLogName('Bluetooth LE Device ' + bluetoothDevice['id'])
      .setName(bluetoothDevice['name'])
      .setProfile(profile);
    device.addEventHandler();
    this.devices[bluetoothDevice['id']] = device;

    // Storing device in type map for easy access.
    if (!(profile.name in this.deviceTypeMap_)) {
      this.deviceTypeMap_[profile.name] = [];
    }
    this.deviceTypeMap_[profile.name].push(device);

    return this.devices[bluetoothDevice['id']];
  }
}


exports = Devices;
