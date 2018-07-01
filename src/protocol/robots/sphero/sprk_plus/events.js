/**
 * @fileoverview Events for the Sphero SPRK+ modification.
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
goog.module('cwc.lib.protocol.sphero.sprkPlus.Events');

const EventData = goog.require('cwc.lib.utils.event.Data');


/**
 * @enum {string}
 */
const Type = {
  CHANGED_LOCATION: 'changed_devices',
  CHANGED_SPEED: 'changed_speed',
  CHANGED_VELOCITY: 'changed_values',
  COLLISION: 'COLLISION',
  CONNECT: 'connect',
};

exports.Type = Type;


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.locationData = function(data) {
  return new EventData(Type.CHANGED_LOCATION, data);
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.velocityData = function(data) {
  return new EventData(Type.CHANGED_VELOCITY, data);
};


/**
 * @param {Object|number} data
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.speedValue = function(data) {
  return new EventData(Type.CHANGED_SPEED, data);
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.collision = function(data) {
  return new EventData(Type.COLLISION, data);
};


/**
 * @param {string} data
 * @param {number} step
 * @return {!cwc.utils.EventData}
 * @final
 */
exports.connect = function(data, step) {
  return new EventData(Type.CONNECT, data, step);
};
