/**
 * @fileoverview mBot Ranger events.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
goog.module('cwc.lib.protocol.makeblock.mBotRanger.Events');

const EventData = goog.require('cwc.lib.utils.event.Data');


/**
 * Custom events.
 * @enum {string}
 */
const Type = {
  CONNECT: 'connect',
  LIGHTNESS_SENSOR: 'CHANGED_LIGHTNESS',
  LINEFOLLOWER_SENSOR: 'CHANGED_LINEFOLLOWER',
  TEMPERATURE_SENSOR: 'CHANGED_TEMPERATURE',
  ULTRASONIC_SENSOR: 'CHANGED_ULTRASONIC',
};

exports.Type = Type;


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


/**
 * @param {!Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.TemperatureSensorValue = function(data, port) {
  return new EventData(Type.TEMPERATURE_SENSOR, data, port);
};
