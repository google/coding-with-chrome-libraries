/**
 * @fileoverview Lego WeDo 2.0 Event definitions.
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
goog.module('cwc.lib.protocol.lego.weDo2.Events');

const EventData = goog.require('cwc.lib.utils.event.Data');


/**
 * Custom events.
 * @enum {string}
 */
const Type = {
  BUTTON_PRESSED: 'BUTTON_PRESSED',
  CHANGED_DEVICE: 'CHANGED_DEVICE',
  CONNECT: 'connect',
};

exports.Type = Type;


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 */
exports.buttonPressed = function(data) {
  return new EventData(Type.BUTTON_PRESSED, data);
};


/**
 * @param {string} data
 * @param {number} step
 * @return {!cwc.utils.EventData}
 */
exports.connect = function(data, step) {
  return new EventData(Type.CONNECT, data, step);
};


/**
 * @param {Object} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 */
exports.changedDevice = function(data, port) {
  return new EventData(Type.CHANGED_DEVICE, data, port);
};
