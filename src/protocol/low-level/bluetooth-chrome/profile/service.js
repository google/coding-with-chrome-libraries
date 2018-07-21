/**
 * @fileoverview List of known and supported Bluetooth services.
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
goog.module('cwc.lib.protocol.bluetoothChrome.profile.Service');


/**
 * @enum {string}
 */
exports = {
  SSP: '00001101-0000-1000-8000-00805f9b34fb',
  DUN: '00001103-0000-1000-8000-00805f9b34fb',
  HID: '00001124-0000-1000-8000-00805f9b34fb',
  HCRP: '00001126-0000-1000-8000-00805f9b34fb',
};
