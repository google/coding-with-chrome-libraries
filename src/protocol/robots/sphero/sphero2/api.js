/**
 * @fileoverview Handles the communication with the Sphero Classic unit.
 *
 * This api allows to read and control the Sphero sensors and actors over an
 * Bluetooth connection.
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
goog.module('cwc.lib.protocol.sphero.sphero2.Api');

const BluetoothEvents = goog.require('cwc.lib.protocol.bluetoothChrome.Events');
const Constants = goog.require('cwc.lib.protocol.sphero.sphero2.Constants');
const DefaultApi = goog.require('cwc.lib.protocol.Api');
const Events = goog.require('cwc.lib.protocol.sphero.sphero2.Events');
const Handler = goog.require('cwc.lib.protocol.sphero.sphero2.Handler');
const Monitoring = goog.require('cwc.lib.protocol.sphero.sphero2.Monitoring');
const StreamReader = goog.require('cwc.lib.utils.stream.Reader');


/**
 * @class
 */
class Api extends DefaultApi {
  /**
   *
   */
  constructor() {
    super('Sphero 2.0', Handler);

    /** @type {!cwc.lib.protocol.sphero.sphero2.Monitoring} */
    this.monitoring = new Monitoring(this);

    /** @private {number} */
    this.locationPosX_ = 0;

    /** @private {number} */
    this.locationPosY_ = 0;

    /** @private {number} */
    this.locationVelX_ = 0;

    /** @private {number} */
    this.locationVelY_ = 0;

    /** @private {number} */
    this.locationSog_ = 0;

    /** @private {number} */
    this.locationSpeed_ = 0;

    /** @private {!cwc.lib.utils.StreamReader} */
    this.streamReader_ = new StreamReader()
      .setChecksum(this.verifiyChecksum_)
      .setHeaders([[0xff, 0xff], [0xff, 0xfe]])
      .setMinimumSize(7);
  }


  /**
   * Connects the Sphero device.
   * @param {!cwc.lib.protocol.bluetoothChrome.Device} device
   * @return {boolean} Was able to prepare and connect to the Sphero.
   * @export
   */
  connect(device) {
    if (super.connect(device)) {
      this.log_.info('Preparing Sphero 2.0 api for', device.getAddress());
      this.connectEvent('Preparing device ...', 1);
      this.connectEvent('Prepare Sphero 2.0 api for' + device.getAddress(), 2);
      this.prepare();
      this.runTest();
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
      this.handleData_.bind(this));
    this.exec('setRGB', {'red': 255, 'persistent': true});
    this.exec('getRGB');
    this.exec('setRGB', {'green': 255, 'persistent': true});
    this.exec('getRGB');
    this.exec('setRGB', {'blue': 255, 'persistent': true});
    this.exec('getRGB');
    this.exec('setCollisionDetection');
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
   * Run self test.
   */
  runTest() {
    this.log_.info('Prepare self test…');
    this.exec('setRGB', {'red': 255, 'persistent': true});
    this.exec('setRGB', {'green': 255, 'persistent': true});
    this.exec('setRGB', {'blue': 255, 'persistent': true});
    this.exec('setRGB', {'persistent': true});
    this.exec('setBackLed', {'brightness': 100});
    this.exec('setBackLed', {'brightness': 75});
    this.exec('setBackLed', {'brightness': 50});
    this.exec('setBackLed', {'brightness': 25});
    this.exec('setBackLed');
    this.exec('setRGB', {'green': 128});
    this.exec('roll', {'speed': 0, 'heading': 180});
  }


  /**
   * Basic cleanup for the Sphero device.
   */
  cleanUp() {
    this.log_.info('Clean up ...');
    this.exec('stop');
    this.events_.clear();
    this.monitoring.cleanUp();
  }


  /**
   * @param {Object} data
   * @private
   */
  updateLocationData_(data) {
    let xpos = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
    let ypos = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
    let xvel = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
    let yvel = cwc.utils.ByteTools.signedBytesToInt([data[6], data[7]]);
    let speed = cwc.utils.ByteTools.bytesToInt([data[8], data[9]]);

    if (xpos != this.locationPosX_ || ypos != this.locationPosY_) {
      this.locationPosX_ = xpos;
      this.locationPosY_ = ypos;
      this.eventTarget_.dispatchEvent(Events.locationData({x: xpos, y: ypos}));
    }

    if (xvel != this.locationVelX_ || yvel != this.locationVelY_) {
      this.locationVelX_ = xvel;
      this.locationVelY_ = yvel;
      this.eventTarget_.dispatchEvent(Events.velocityData({x: xvel, y: yvel}));
    }

    if (speed != this.locationSpeed_) {
      this.locationSpeed_ = speed;
      this.eventTarget_.dispatchEvent(Events.speedValue(speed));
    }
  }


  /**
   * @param {Object} data
   * @private
   */
  parseCollisionData_(data) {
    let x = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
    let y = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
    let z = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
    let axis = data[6] == 0x01 ? 'y' : 'x';
    let xMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[7], data[8]]);
    let yMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[9], data[10]]);
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
   * Handles packets from the Bluetooth socket.
   * @param {Event} e
   * @private
   */
  handleData_(e) {
    let dataBuffer = this.streamReader_.readByHeader(e.data);
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
      if (len = 1 && messageResponse === Constants.ResponseType.PRE_SLEEP) {
        this.log_.warn('Pre-sleep warning (10 sec)');
        return;
      }
      // Handles received data and callbacks from the Bluetooth socket.
      switch (seq) {
        case Constants.CallbackType.RGB:
          this.log_.info('RGB:', data[0], data[1], data[2]);
          break;
        case Constants.CallbackType.LOCATION:
          this.log_.info('Location', data);
          this.updateLocationData_(data);
          break;
        default:
          this.log_.info('Received type', seq, 'with', len,
            ' bytes of unknown data:', data);
      }
    } else if (messageType === Constants.ResponseType.ASYNCHRONOUS) {
      // Handles async packets from the Bluetooth socket.
      switch (messageResponse) {
        case Constants.MessageType.PRE_SLEEP:
          this.log_.info('Sphero 2.0 is tired ...');
          break;
        case Constants.MessageType.COLLISION_DETECTED:
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
