/**
 * @fileoverview Handles the communication with the Sphero 2.0 unit.
 *
 * This api allows to read and control the Sphero sensors and actors over an
 * Bluetooth connection.
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
goog.module('cwc.lib.protocol.sphero.sprkPlus.Api');

const ByteTools = goog.require('cwc.lib.utils.byte.Tools');
const Constants = goog.require('cwc.lib.protocol.sphero.sprkPlus.Constants');
const Decoder = goog.require('cwc.lib.protocol.sphero.sprkPlus.Decoder');
const DefaultApi = goog.require('cwc.lib.protocol.Api');
const Events = goog.require('cwc.lib.protocol.sphero.sprkPlus.Events');
const Handler = goog.require('cwc.lib.protocol.sphero.sprkPlus.Handler');
const Monitoring = goog.require('cwc.lib.protocol.sphero.sprkPlus.Monitoring');
const StreamReader = goog.require('cwc.lib.utils.stream.Reader');


/**
 * @class
 */
class Api extends DefaultApi {
  /**
   *
   */
  constructor() {
    super('Sphero Sprk+', Handler);

    /** @type {!cwc.lib.protocol.sphero.sprkPlus.Monitoring} */
    this.monitoring = new Monitoring(this);

    /** @private {!cwc.lib.utils.StreamReader} */
    this.streamReader_ = new StreamReader()
      .setChecksum(this.verifiyChecksum_)
      .setHeaders([[0xff, 0xff], [0xff, 0xfe]])
      .setMinimumSize(7);
  }


  /**
   * Connects the Sphero ball.
   * @param {!cwc.protocol.bluetooth.lowEnergy.Device} device
   * @return {boolean} Was able to prepare and connect to the Sphero.
   * @export
   */
  connect(device) {
    if (super.connect(device)) {
      this.log_.info('Preparing Sphero bluetooth LE api for', device.getId());
      this.connectEvent('Preparing device ...', 1);

      // Enable Developer mode.
      this.device.sendRaw(
        new TextEncoder('utf-8').encode('011i3'),
        '22bb746f-2bbd-7554-2d6f-726568705327', () => {
          this.eventTarget_.dispatchEvent(Events.connect(
            'Enable developer mode ...', 2));
      });

      // Power on device.
      this.device.sendRaw(
        new Uint8Array([0x07]), '22bb746f-2bb2-7554-2d6f-726568705327', () => {
          this.connectEvent(
            'Power on device. Waiting until device wakes up ...', 2);
      });

      // Wakeup device.
      this.device.sendRaw(
        new Uint8Array([0x01]), '22bb746f-2bbf-7554-2d6f-726568705327', () => {
          this.prepare();
          this.runTest();
          this.connectEvent('Ready ...', 3);
      });
      return true;
    }
    return false;
  }


  /**
   * @export
   */
  disconnect() {
    this.log_.info('Disconnecting Sphero bluetooth LE api for',
      this.device.getId());
    this.exec('stop');
    this.events_.clear();
    this.monitoring.cleanUp();
    this.device.disconnect();
  }


  /**
   * @export
   */
  prepare() {
    this.device.listen('22bb746f-2ba6-7554-2d6f-726568705327',
      this.handleData_.bind(this));
    this.exec('getDeviceInfo');
    this.exec('setCollisionDetection');
    this.monitoring.start();
    this.prepared = true;
  }


  /**
   * @param {boolean} enable
   * @export
   */
  monitor(enable) {
    console.log('monitor', enable, this.isConnected());
    if (enable && this.isConnected()) {
      this.monitoring.start();
    } else if (!enable) {
      this.monitoring.stop();
    }
  }


  /**
   * Run self test.
   */
  runTest() {
    this.log_.info('Prepare self test…');
    this.exec('setRGB', {'red': 255, 'persistent': true});
    this.exec('getRGB');
    this.exec('setRGB', {'green': 255, 'persistent': true});
    this.exec('getRGB');
    this.exec('setRGB', {'blue': 255, 'persistent': true});
    this.exec('getRGB');
    this.exec('setBackLed', {'brightness': 100});
    this.exec('setBackLed', {'brightness': 75});
    this.exec('setBackLed', {'brightness': 50});
    this.exec('setBackLed', {'brightness': 25});
    this.exec('setBackLed');
    this.exec('setRGB', {'green': 128});
    this.exec('roll', {'speed': 0, 'heading': 180});
  }


  /**
   * @param {Object} data
   * @private
   */
  parseCollisionData_(data) {
    let x = ByteTools.signedShortToInt([data[0], data[1]]);
    let y = ByteTools.signedShortToInt([data[2], data[3]]);
    let z = ByteTools.signedShortToInt([data[4], data[5]]);
    let axis = data[6] == 0x01 ? 'y' : 'x';
    let xMagnitude = ByteTools.signedShortToInt([data[7], data[8]]);
    let yMagnitude = ByteTools.signedShortToInt([data[9], data[10]]);
    let speed = data[11];
    this.eventTarget_.dispatchEvent(
      Events.collision({
        x: x,
        y: y,
        z: z,
        axis: axis,
        magnitude: {
          x: xMagnitude,
          y: yMagnitude,
        },
        speed: speed,
      }));
  }


  /**
   * @param {!Array} buffer
   * @private
   */
  handleData_(buffer) {
    let dataBuffer = this.streamReader_.readByHeader(buffer);
    if (!dataBuffer) {
      return;
    }

    // Verify packet length.
    let packetLength = dataBuffer[4] + 5;
    if (dataBuffer.length < packetLength) {
      this.streamReader_.addBuffer(dataBuffer);
      return;
    } else if (dataBuffer.length > packetLength) {
      dataBuffer = dataBuffer.slice(0, packetLength);
      this.streamReader_.addBuffer(dataBuffer.slice(packetLength));
    }

    // Handling packet message.
    let messageType = dataBuffer[1];
    let messageResponse = dataBuffer[2];
    let seq = dataBuffer[3];
    let len = dataBuffer[4];
    let data = dataBuffer.slice(5, 4 + len);

    if (messageType === Constants.ResponseType.ACKNOWLEDGEMENT) {
      // Handles received data and callbacks from the Bluetooth socket.
      switch (seq) {
        case Constants.CallbackType.DEVICE_INFO: {
          let deviceInfo = Decoder.deviceInfo(data);
          this.log_.info('Name:', deviceInfo.name,
            'Address:', deviceInfo.address, 'Id:', deviceInfo.id);
          break;
        }
        case Constants.CallbackType.RGB: {
          this.eventTarget_.dispatchEvent(Events.rgb(Decoder.rgb(data)));
          break;
        }
        case Constants.CallbackType.LOCATION: {
          let location = Decoder.location(data);
          this.eventTarget_.dispatchEvent(Events.position(location.position));
          break;
        }
        default:
          this.log_.info('Received type', seq, 'with', len,
            ' bytes of unknown data:', data);
      }
    } else if (messageType === Constants.ResponseType.ASYNCHRONOUS) {
      // Handles async packets from the Bluetooth socket.
      switch (messageResponse) {
        case Constants.MessageType.PRE_SLEEP:
          this.log_.info('Sphero SPRK+ is tired ...');
          break;
        case Constants.MessageType.COLLISION_DETECTED:
          this.log_.info('Collision', data);
          this.parseCollisionData_(data);
          break;
        default:
          this.log_.info('Received message', messageResponse, 'with', len,
            ' bytes of unknown data:', data);
      }
    } else {
      this.log_.error('Data error ...', dataBuffer);
    }
  }


  /**
   * @param {!Array} buffer
   * @param {Number=} checksum
   * @return {boolean}
   * @private
   */
  verifiyChecksum_(buffer, checksum) {
    // SOP1 always 0xFF and minimum packet size of 6
    if (!buffer || buffer[0] !== 0xFF || buffer.length < 6) {
      return false;
    }
    let packetLength = buffer[4] + 4;
    if (!checksum) {
      checksum = buffer[packetLength];
    }
    let bufferChecksum = 0;
    for (let i = 2; i < packetLength; i++) {
      bufferChecksum += buffer[i];
    }
    return (checksum === (bufferChecksum % 256) ^ 0xFF) ? true : false;
  }
}


exports = Api;
