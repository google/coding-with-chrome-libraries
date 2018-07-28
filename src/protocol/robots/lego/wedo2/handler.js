/**
 * @fileoverview Command Handler for Lego WeDo 2.0 implementation.
 *
 * This api allows to read and control the Lego WeDo sensors and actors over an
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
goog.module('cwc.lib.protocol.lego.weDo2.Handler');

const Commands = goog.require('cwc.lib.protocol.lego.weDo2.Commands');
const Constants = goog.require('cwc.lib.protocol.lego.weDo2.Constants');


/**
 * @class
 */
class Handler {
  /**
   *
   */
  constructor() {
  }


  /**
   * @param {!Object} data
   * @return {!cwc.lib.protocol.lego.weDo2.Buffer}
   */
  ['playTone'](data) {
    return Commands.playTone(data['frequency'], data['duration']);
  }


  /**
   * @param {!Object} data
   * @return {!cwc.lib.protocol.lego.weDo2.Buffer}
   */
  ['setRGB'](data) {
    return Commands.setRGB(data['color']);
  }


  /**
   * @param {!Object} data
   * @return {!cwc.lib.protocol.lego.weDo2.Buffer}
   */
  ['movePower'](data) {
    return Commands.movePower(data['power'], data['port']);
  }


  /**
   * @param {!Object} data
   * @return {!cwc.lib.protocol.lego.weDo2.Buffer}
   */
  ['moveSpeed'](data) {
    let speed = data['reverse'] ? 255 - Constants.Speed[data['speed']] :
      Constants.Speed[data['speed']];
    return Commands.movePower(speed || 0, data['port']);
  }


  /**
   * @param {!Object} data
   * @return {!cwc.lib.protocol.lego.weDo2.Buffer}
   */
  ['setSensorMode'](data) {
    return Commands.setSensorMode(data['port'], data['type'], data['mode']);
  }


  /**
   * Stops the Sphero device.
   * @return {!Array<cwc.lib.protocol.lego.weDo2.Buffer>}
   */
  ['stop']() {
    return [
      Commands.movePower(0x7f, 0x01),
      Commands.movePower(0x7f, 0x02),
    ];
  }
}


exports = Handler;
