/**
 * @fileoverview List of known and supported Bluetooth devices.
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
goog.module('cwc.lib.protocol.bluetoothChrome.profile.Device');

const Service =
  goog.require('cwc.lib.protocol.bluetoothChrome.profile.Service');


/**
 * Lego Mindstorms EV3
 * @enum {number|string}
 */
exports.LEGO_EV3 = {
  name: 'Lego Mindstorms EV3',
  namePrefix: 'EV3',
  deviceClass: 2052,
  uuid: Service.SSP,
  icon: 'adb',
};


/**
 * Sphero 2.0
 * @enum {number|string}
 */
exports.SPHERO_SPHERO2 = {
  name: 'Sphero 2.0',
  namePrefix: 'Sphero',
  deviceClass: 2360392,
  uuid: Service.SSP,
  icon: 'adjust',
};


/**
 * Makeblock mBot
 * @enum {number|string}
 */
exports.MAKEBLOCK_MBOT = {
  name: 'Makeblock mBot',
  namePrefix: 'Makeblock',
  deviceClass: 5898756,
  uuid: Service.SSP,
};


/**
 * Makeblock mBot
 * @enum {number|string}
 */
exports.MAKEBLOCK_RANGER = {
  name: 'Makeblock Ranger',
  namePrefix: 'Makeblock',
  deviceClass: 5898756,
  uuid: Service.SSP,
};
