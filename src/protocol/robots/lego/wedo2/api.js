/**
 * @fileoverview Handles the communication with the WeDo 2.0 unit.
 *
 * This api allows to read and control the Lego WeDo 2.0 sensors and
 * actors over an Bluetooth connection.
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
goog.module('cwc.lib.protocol.lego.weDo2.Api');

const BluetoothProfile = goog.require('cwc.lib.protocol.bluetoothWeb.Profile');
const ByteTools = goog.require('cwc.lib.utils.byte.Tools');
const DefaultApi = goog.require('cwc.lib.protocol.Api');
const Events = goog.require('cwc.lib.protocol.lego.weDo2.Events');
const Handler = goog.require('cwc.lib.protocol.lego.weDo2.Handler');


/**
 * @class
 */
class Api extends DefaultApi {
  /**
   *
   */
  constructor() {
    super('Lego WeDo 2.0', Handler);
  }


  /**
   * Connects the WeDo 2.0 device.
   * @param {!cwc.lib.protocol.bluetoothChrome.Device} device
   * @return {boolean} Was able to prepare and connect to the WeDo 2.0.
   * @export
   */
  connect(device) {
    if (!device) {
      return false;
    } else if (!device.isConnected()) {
      console.error('WeDo 2.0 device is not ready yet...');
      return false;
    }

    if (!this.prepared) {
      console.log('Preparing Lego WeDo 2.0 api for', device.getId());
      this.eventTarget_.dispatchEvent(Events.connect(
        'Prepare Lego WeDo 2.0 api for' + device.getId(), 2));
      this.device = device;
      this.prepare();
      this.runTest();
      this.eventTarget_.dispatchEvent(Events.connect('Ready ...', 3));
    }
    return true;
  }


  /**
   * @export
   */
  prepare() {
    this.device.listen('0000152d-1212-efde-1523-785feabcd123', (e) => {
      console.log('battery', e);
    });
    this.device.listen(BluetoothProfile.Characteristic.LEGO.WEDO2.device.button,
      this.handleButtonEvent_.bind(this));
    this.device.listen(BluetoothProfile.Characteristic.LEGO.WEDO2.device.port,
      this.handlePortEvent_.bind(this));
    this.device.listen(
      BluetoothProfile.Characteristic.LEGO.WEDO2.control.sensor,
      this.handleSensorEvent_.bind(this));
    this.exec('playTone', {'frequency': 2000, 'duration': 200});
    this.exec('playTone', {'frequency': 3000, 'duration': 200});
    this.exec('setRGB', {'color': 9});
    this.prepared = true;
  }


  /**
   * Run self test.
   */
  runTest() {
    this.log_.info('Prepare self test…');
    this.exec('setRGB', {'color': 9});
    this.exec('setRGB', {'color': 8});
    this.exec('setRGB', {'color': 7});
    this.exec('setRGB', {'color': 6});
    this.exec('setRGB', {'color': 5});
    this.exec('setRGB', {'color': 4});
    this.exec('setRGB', {'color': 3});
    this.exec('setRGB', {'color': 2});
    this.exec('setRGB', {'color': 1});
  }


  /**
   * @param {!ArrayBuffer} buffer
   * @private
   */
  handleSensorEvent_(buffer) {
    let data = ByteTools.getUint8Array(buffer);
    this.log_.info('handleSensorEvent', data);
  }


  /**
   * @param {!ArrayBuffer} buffer
   * @private
   */
  handleButtonEvent_(buffer) {
    let data = ByteTools.getUint8Array(buffer);
    this.eventTarget_.dispatchEvent(Events.buttonPressed(data[0]));
  }


  /**
   * @param {!ArrayBuffer} buffer
   * @private
   */
  handlePortEvent_(buffer) {
    let data = ByteTools.getUint8Array(buffer);
    this.log_.info('handlePortEvent', data);
    let port = data[0];
    let connected = data[1];
    let type = connected ? data[3] : 0;
    if (connected && (type === 34 || type === 35)) {
      this.enableSensorEvents_(port, type);
    }
    this.eventTarget_.dispatchEvent(Events.changedDevice(type, port));
  }


  /**
   * @param {number} port
   * @param {number} type
   */
  enableSensorEvents_(port, type) {
    this.log_.info('Enable Sensor Events for', type, 'on', port);
    let buffer = this.getBuffer('setSensorMode', {
      'port': port,
      'type': type,
      'mode': 0x00,
    });
    this.device.sendRaw(buffer, '00001563-1212-efde-1523-785feabcd123');
  }


  /**
   * Basic cleanup for the WeDo 2.0 unit.
   */
  cleanUp() {
    this.log_.info('Clean up ...');
    this.events_.clear();
  }
}


exports = Api;
