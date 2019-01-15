/**
 * @fileoverview Bluetooth Chrome Event definitions.
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
goog.module('cwc.lib.protocol.bluetoothChrome.Events');

const EventData = goog.require('cwc.lib.utils.event.Data');


/**
 * @enum {number}
 */
const Type = {
  ADAPTER_STATE_CHANGE: 1,
  DEVICE_STATE_CHANGE: 2,
  ON_RECEIVE: 3,
};

exports.Type = Type;


/**
 * @param {!Object} data
 * @return {!EventData}
 * @final
 */
exports.adapterState = function(data) {
  return new EventData(Type.ADAPTER_STATE_CHANGE, data);
};


/**
 * @param {!Object} data
 * @return {!EventData}
 * @final
 */
exports.deviceState = function(data) {
  return new EventData(Type.DEVICE_STATE_CHANGE, data);
};


/**
 * @param {!ArrayBuffer} data
 * @return {!EventData}
 * @final
 */
exports.onReceive = function(data) {
  return new EventData(Type.ON_RECEIVE, data);
};
