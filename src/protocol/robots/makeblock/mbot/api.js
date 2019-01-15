/**
 * @fileoverview Handles the communication with Makeblock mBots.
 *
 * This api allows to read and control the Makeblock mBot kits with
 * bluetooth connection.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.module('cwc.lib.protocol.makeblock.mBot.Api');

const BluetoothEvents = goog.require('cwc.lib.protocol.bluetoothChrome.Events');
const Constants = goog.require('cwc.lib.protocol.makeblock.mBot.Constants');
const DefaultApi = goog.require('cwc.lib.protocol.Api');
const Events = goog.require('cwc.lib.protocol.makeblock.mBot.Events');
const Handler = goog.require('cwc.lib.protocol.makeblock.mBot.Handler');
const Monitoring = goog.require('cwc.lib.protocol.makeblock.mBot.Monitoring');
const StreamReader = goog.require('cwc.lib.utils.stream.Reader');


/**
 * @class
 */
class Api extends DefaultApi {
  /**
   *
   */
  constructor() {
    super('mBot', Handler);

    /** @type {!Constants.Monitoring} */
    this.monitoring = new Monitoring(this);

    /** @private {!Object} */
    this.sensorDataCache_ = {};

    /** @private {!StreamReader} */
    this.streamReader_ = new StreamReader()
      .setHeaders([0xff, 0x55])
      .setFooter([0x0d, 0x0a])
      .setMinimumSize(4);
  }


  /**
   * Connects the mbot.
   * @param {!cwc.lib.protocol.bluetoothChrome.Device} device
   * @return {boolean} Was able to prepare and connect to the mbot.
   * @export
   */
  connect(device) {
    if (super.connect(device)) {
      this.log_.info('Preparing mBot api for', device.getAddress());
      this.connectEvent('Preparing device ...', 1);
      this.connectEvent('Prepare mBot api for' + device.getAddress(), 2);
      this.prepare();
      this.connectEvent('Ready ...', 3);
      return true;
    }
    return false;
  }


  /**
   * @export
   */
  prepare() {
    this.events_.listen(
      this.device.getEventTarget(),
      BluetoothEvents.Type.ON_RECEIVE,
      this.handleOnReceive_.bind(this));
    this.exec('playTone', {'frequency': 524, 'duration': 240});
    this.exec('playTone', {'frequency': 584, 'duration': 240});
    this.exec('getVersion');
    this.prepared = true;
  }


  /**
   * @param {boolean} enable
   * @export
   */
  monitor(enable) {
    if (enable && this.isConnected()) {
      this.monitoring.start();
    } else if (!enable) {
      this.monitoring.stop();
    }
  }


  /**
   * Basic cleanup for the mBot unit.
   */
  cleanUp() {
    this.log_.info('Clean up ...');
    this.reset();
    this.events_.clear();
    this.monitoring.cleanUp();
  }


  /**
   * Resets the mbot connection and cache.
   * @export
   */
  reset() {
    this.sensorDataCache_ = {};
    if (this.device) {
      this.exec('stop');
      this.device.reset();
    }
  }


  /**
   * Convert float bytes to float value in robot response;
   * @param {!Array} dataBytes bytes from the robot
   * @return {number} float value
   * @private
   */
  parseFloatBytes_(dataBytes) {
    let intValue = this.fourBytesToInt_(
      dataBytes[3], dataBytes[2], dataBytes[1], dataBytes[0]);
    let result = parseFloat(this.intBitsToFloat_(intValue).toFixed(2));
    return result;
  }


  /**
   * Convert four bytes (b4b3b2b1) to a single int.
   * @param {number} b1
   * @param {number} b2
   * @param {number} b3
   * @param {number} b4
   * @return {number} the result int
   * @private
   */
  fourBytesToInt_(b1, b2, b3, b4) {
    return ( b1 << 24 ) + ( b2 << 16 ) + ( b3 << 8 ) + b4;
  }


  /**
   * Convert from int (in byte form) to float
   * @param {number} num the input int value
   * @return {number} the result as float
   * @private
   */
  intBitsToFloat_(num) {
    /* s 为符号（sign）；e 为指数（exponent）；m 为有效位数（mantissa）*/
    let sign = ( num >> 31 ) == 0 ? 1 : -1;
    let exponent = ( num >> 23 ) & 0xff;
    let mantissa = ( exponent == 0 ) ?
      ( num & 0x7fffff ) << 1 : ( num & 0x7fffff ) | 0x800000;
    return sign * mantissa * Math.pow( 2, exponent - 150 );
  }


  /**
   * Handles packets from the Bluetooth socket.
   * @param {!Event} e
   * @private
   */
  handleOnReceive_(e) {
    let data = this.streamReader_.readByHeaderAndFooter(e.data);
    if (!data) {
      return;
    }
    for (let i = 0, len = data.length; i < len; i++) {
      let dataBuffer = data[i];

      // Ignore empty and OK packages with 0xff, 0x55, 0x0d, 0x0a
      if (dataBuffer.length > 4) {
        this.handleData_(dataBuffer);
      }
    }
  }


  /**
   * Handles the single data packages.
   * @param {!Uint8Array} dataBuffer
   * @private
   */
  handleData_(dataBuffer) {
    let len = dataBuffer[1];
    let indexType = dataBuffer[2];
    let dataType = dataBuffer[3];
    let data = dataBuffer.slice(4);
    switch (indexType) {
      case Constants.CallbackType.VERSION:
        this.log_.info('mBot Firmware', new TextDecoder('utf-8').decode(data));
        break;
      case Constants.CallbackType.ULTRASONIC:
      case Constants.CallbackType.LINEFOLLOWER:
      case Constants.CallbackType.LIGHTSENSOR:
        this.handleSensorData_(indexType, data, 4);
        break;
      case Constants.CallbackType.INNER_BUTTON:
        this.handleSensorData_(indexType, data);
        break;
      default:
        this.log_.info('UNKNOWN index', len, indexType, dataType, dataBuffer);
    }
  }


  /**
   * Handles the different type of sensor data.
   * @param {!Constants.CallbackType} type
   * @param {!Array} data
   * @param {number=} data_size
   * @private
   */
  handleSensorData_(type, data, data_size) {
    if (data_size && data.length < data_size) {
      return;
    }

    if (this.sensorDataCache_[type] !== undefined &&
        cwc.utils.ByteTools.isArrayBufferEqual(
          this.sensorDataCache_[type], data)) {
      return;
    }
    this.sensorDataCache_[type] = data;

    switch (type) {
      case Constants.CallbackType.INNER_BUTTON:
        this.dispatchSensorEvent_(type, Events.ButtonPressed, data[0]);
        break;
      case Constants.CallbackType.LIGHTSENSOR:
        this.dispatchSensorEvent_(type, Events.LightnessSensorValue,
          this.parseFloatBytes_(data));
        break;
      case Constants.CallbackType.LINEFOLLOWER:
        this.dispatchSensorEvent_(type, Events.LinefollowerSensorValue, {
            'left': data[3] >= 64,
            'right': data[2] >= 64,
            'raw': data,
          });
        break;
      case Constants.CallbackType.ULTRASONIC:
        this.dispatchSensorEvent_(type, Events.UltrasonicSensorValue,
          this.parseFloatBytes_(data));
        break;
    }
  }


  /**
   * Dispatch event for sensor data change.
   * @param {!Constants.CallbackType} index
   * @param {!Function} event
   * @param {!Object|number} data
   * @private
   */
  dispatchSensorEvent_(index, event, data) {
    this.eventTarget_.dispatchEvent(event(data));
  }
}


exports = Api;
