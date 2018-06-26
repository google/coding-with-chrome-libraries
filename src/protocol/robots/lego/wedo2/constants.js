/**
 * @fileoverview Lego WeDo 2.0 Constants
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
goog.module('cwc.lib.protocol.lego.weDo2.Constants');


/**
 * @enum {number}
 */
exports.Channel = {
  PORT1: 0x01,
  PORT2: 0x02,
  CURRENT: 0x03,
  VOLTAGE: 0x04,
  TONE: 0x05,
  RGB: 0x06,
};


exports.Device = {
  MOTOR: 0x01,
  GYROSCOPE: 0x22,
  MOTION: 0x23,
};


/**
 * @enum {number}
 */
exports.Speed = {
  0: 0x00,
  1: 0x2a,
  2: 0x30,
  3: 0x36,
  4: 0x3d,
  5: 0x44,
  6: 0x4a,
  7: 0x50,
  8: 0x5e,
  9: 0x7f,
};
