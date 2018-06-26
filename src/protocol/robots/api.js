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

    /** @type {Object} */
    this.device = null;

    /** @type {!goog.events.EventTarget} */
    this.eventTarget_ = new EventTarget();

    /** @private {!cwc.lib.utils.event.Handler} */
    this.events_ = new EventHandler(this.name);

    /** @type {!Function} */
    this.handler = new Handler();

    /** @private {!cwc.lib.utils.StreamReader} */
    this.streamReader_ = new StreamReader();

    /** @private {!cwc.lib.utils.Logger} */
    this.log_ = new Logger(this.name);
  }


  /**
   * Executer for the default handler commands.
   * @param {string} command
   * @param {Object=} data
   * @export
   */
  exec(command, data = {}) {
    this.send_(this.handler[command](data));
  }


  /**
   * @param {string} command
   * @param {Object=} data
   * @return {!ArrayBuffer}
   */
  getBuffer(command, data = {}) {
    return this.handler[command](data);
  }


  /**
   * @return {!goog.events.EventTarget}
   */
  getEventTarget() {
    return this.eventTarget_;
  }

  /**
   * @param {!Array<ArrayBuffer>|ArrayBuffer} buffer
   * @private
   */
  send_(buffer) {
    if (this.device) {
      this.device.send(buffer);
    }
  }
}


exports = Api;
