/**
 * @fileoverview Decoder for Sphero SPRK+.
 *
 * This api allows to read and control the Sphero sensors and actors over an
 * Bluetooth connection.
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
goog.module('cwc.lib.protocol.sphero.sprkPlus.Decoder');

const ByteTools = goog.require('cwc.lib.utils.byte.Tools');


/**
 * @param {Array.<Uint8Array>} data
 * @return {Object}
 */
exports.deviceInfo = function(data) {
  let name = new TextDecoder('utf-8').decode(data.slice(0, 16));
  let address = new TextDecoder('utf-8').decode(data.slice(16, 29));
  let id = data.slice(29, 32);
  return {
    name: name,
    address: address,
    id: id,
  };
};


/**
 * @param {Array.<Uint8Array>} data
 * @return {Object}
 */
exports.rgb = function(data) {
  return {
    r: data[0],
    g: data[1],
    b: data[2],
  };
};


/**
 * @param {Array.<Uint8Array>} data
 * @return {Object}
 */
exports.location = function(data) {
  let xpos = ByteTools.signedShortToInt([data[0], data[1]]);
  let ypos = ByteTools.signedShortToInt([data[2], data[3]]);
  let xvel = ByteTools.signedShortToInt([data[4], data[5]]);
  let yvel = ByteTools.signedShortToInt([data[6], data[7]]);
  let sog = ByteTools.bytesToInt([data[8], data[9]]);
  return {
    position: {
      x: xpos,
      y: ypos,
    },
    velocity: {
      x: xvel,
      y: yvel,
    },
    sog: sog,
  };
};
