/**
 * @fileoverview Command Handler for Makeblock mBots implementation.
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
goog.module('cwc.lib.protocol.makeblock.mBot.Handler');

const Commands = goog.require('cwc.lib.protocol.makeblock.mBot.Commands');
const Constants = goog.require('cwc.lib.protocol.makeblock.mBot.Constants');


/**
 * @class
 * @unrestricted
 */
class Handler {
  /**
   *
   */
  constructor() {}


  /**
   * Powers the motor.
   * @param {!Object} data
   * @return {!cwc.lib.protocol.makeblock.mBot.Buffer}
   */
  ['movePower'](data) {
    if (data['slot'] === undefined) {
      return [
        Commands.movePower(-data['power'], Constants.Port.LEFT_MOTOR),
        Commands.movePower(data['power'], Constants.Port.RIGHT_MOTOR),
      ];
    }
    return Commands.movePower(data['power'], data['slot']);
  }


  /**
   * Powers the motor.
   * @param {!Object} data
   * @return {!cwc.lib.protocol.makeblock.mBot.Buffer}
   */
  ['rotatePower'](data) {
    if (data['slot'] === undefined) {
      return [
        Commands.movePower(data['power'], Constants.Port.LEFT_MOTOR),
        Commands.movePower(data['power'], Constants.Port.RIGHT_MOTOR),
      ];
    }
    return Commands.movePower(data['power'], data['slot']);
  }


  /**
   * Sets led light on the top of the mbot
   * @param {!Object} data
   * @return {!cwc.lib.protocol.makeblock.mBot.Buffer}
   */
  ['setRGBLED'](data) {
    return Commands.setRGBLED(
      data['red'], data['green'], data['blue'], data['index']);
  }


  /**
   * Plays a tone through mBot's buzzer
   * @param {!Object} data
   * @return {!cwc.lib.protocol.makeblock.mBot.Buffer}
   */
  ['playTone'](data) {
    return Commands.playTone(data['frequency'], data['duration']);
  }


  /**
   * Device version
   * @return {!cwc.lib.protocol.makeblock.mBot.Buffer}
   */
  ['getVersion']() {
    return Commands.getVersion();
  }


  /**
   * Reads out sensor value.
   * @param {!Object} data
   * @return {!cwc.lib.protocol.makeblock.mBot.Buffer}
   */
  ['getSensorData'](data) {
    return Commands.getSensorData(data['index'], data['device'], data['port']);
  }


  /**
   * Resets the mBot.
   * @return {!cwc.lib.protocol.makeblock.mBot.Buffer}
   */
  ['reset']() {
    return Commands.reset();
  }


  /**
   * Stops mBot.
   * @return {!Array<!cwc.lib.protocol.makeblock.mBot.Buffer>}
   */
  ['stop']() {
    return [
      this['reset'](),
      this['setRGBLED']({}),
      Commands.movePower(0, Constants.Port.LEFT_MOTOR),
      Commands.movePower(0, Constants.Port.RIGHT_MOTOR),
    ];
  }
}


exports = Handler;
