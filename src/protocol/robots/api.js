/**
 * @fileoverview Api main class.
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
goog.module('cwc.lib.protocol.Api');

const EventTarget = goog.require('goog.events.EventTarget');
const EventHandler = goog.require('cwc.lib.utils.event.Handler');
const Logger = goog.require('cwc.lib.utils.log.Logger');
const StreamReader = goog.require('cwc.lib.utils.stream.Reader');


/**
 * @class
 */
class Api {
  /**
   * @param {string} name
   * @param {!Function} Handler
   */
  constructor(name, Handler) {
    /** @type {string} */
    this.name = name || 'Default Api';

    /** @type {boolean} */
    this.prepared = false;

    /** @type {cwc.lib.protocol.bluetoothWeb.Device|Object} */
    this.device = {
      disconnect: function() {},
      isConnected: function() {
        return false;
      },
      reset: function() {},
      send: function() {},
    };

    /** @type {!goog.events.EventTarget} */
    this.eventTarget_ = new EventTarget();

    /** @private {!cwc.lib.utils.event.Handler} */
    this.events_ = new EventHandler(this.name);

    /** @orivate {!Function} */
    this.handler_ = new Handler();

    /** @private {!cwc.lib.utils.StreamReader} */
    this.streamReader_ = new StreamReader();

    /** @private {!cwc.lib.utils.Logger} */
    this.log_ = new Logger(this.name);
  }


  /**
   * Connects the device.
   * @param {!cwc.protocol.bluetooth.lowEnergy.Device} device
   * @return {boolean} Was able to prepare and connect to the device.
   */
  connect(device) {
    if (device && device.isConnected()) {
      this.device = device;
      return !this.prepared;
    }
    this.log_.error('Device is not ready yet...');
    return false;
  }


  /**
   * Disconnects the device.
   */
  disconnect() {
    if (this.device) {
      this.device.disconnect();
    }
    this.cleanUp();
  }


  /**
   * Resets the device.
   */
  reset() {
    if (this.device) {
      this.device.reset();
    }
  }

  /**
   * Executer for the default handler commands.
   * @param {string} command
   * @param {Object=} data
   * @export
   */
  exec(command, data = {}) {
    let buffer = this.handler_[command](data);
    if (Array.isArray(buffer)) {
      for (let i = 0, len = buffer.length; i < len; ++i) {
        this.send_(buffer[i].readSigned(), buffer[i].getCharacteristic());
      }
    } else {
      this.send_(buffer.readSigned(), buffer.getCharacteristic());
    }
  }


  /**
   * @param {string} command
   * @param {Object=} data
   * @return {!ArrayBuffer}
   */
  getBuffer(command, data = {}) {
    return this.handler_[command](data);
  }


  /**
   * @return {!goog.events.EventTarget}
   */
  getEventTarget() {
    return this.eventTarget_;
  }


  /**
   * @return {?}
   */
  getHandler() {
    return this.handler_;
  }


  /**
   * @return {boolean}
   */
  isConnected() {
    return (this.device && this.device.isConnected()) ? true : false;
  }


  /**
   * @param {!Array<ArrayBuffer>|ArrayBuffer} buffer
   * @param {string=} characteristicId
   * @private
   */
  send_(buffer, characteristicId) {
    this.device.send(buffer, characteristicId);
  }
}


exports = Api;
