/**
 * @fileoverview mBot events.
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
goog.module('cwc.lib.protocol.makeblock.mBot.Events');

const EventData = goog.require('cwc.lib.utils.event.Data');


/**
 * Custom events.
 * @enum {string}
 */
const Type = {
  CONNECT: 'connect',
  BUTTON_PRESSED: 'BUTTON_PRESSED',
  LIGHTNESS_SENSOR: 'CHANGED_LIGHTNESS',
  LINEFOLLOWER_SENSOR: 'CHANGED_LINEFOLLOWER',
  ULTRASONIC_SENSOR: 'CHANGED_ULTRASONIC',
};

exports.Type = Type;


/**
 * @param {!Object} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.ButtonPressed = function(data, port) {
  return new EventData(Type.BUTTON_PRESSED, data, port);
};


/**
 * @param {!Object} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.UltrasonicSensorValue = function(data, port) {
  return new EventData(Type.ULTRASONIC_SENSOR, data, port);
};


/**
 * @param {!Object} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.LightnessSensorValue = function(data, port) {
  return new EventData(Type.LIGHTNESS_SENSOR, data, port);
};


/**
 * @param {!Object} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.LinefollowerSensorValue = function(data, port) {
  return new EventData(Type.LINEFOLLOWER_SENSOR, data, port);
};
