/**
 * @fileoverview Command Handler for Makeblock mBot Ranger implementation.
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
goog.module('cwc.lib.protocol.makeblock.mBotRanger.Handler');

const Commands = goog.require('cwc.lib.protocol.makeblock.mBotRanger.Commands');
const Constants =
  goog.require('cwc.lib.protocol.makeblock.mBotRanger.Constants');


/**
 * @class
 */
class Handler {
  /**
   *
   */
  constructor() {}


  /**
   * Powers the motor.
   * @param {!Object} data
   * @return {!ArrayBuffer}
   */
  ['movePower'](data) {
    if (data['slot'] === undefined) {
      return [
        Commands.movePower(-data['power'], Constants.Slot.ONE),
        Commands.movePower(data['power'], Constants.Slot.TWO),
      ];
    }
    return Commands.movePower(data['power'], data['slot']);
  }


  /**
   * Powers the motor.
   * @param {!Object} data
   * @return {!ArrayBuffer}
   */
  ['rotatePower'](data) {
    if (data['slot'] === undefined) {
      return [
        Commands.movePower(data['power'], Constants.Slot.ONE),
        Commands.movePower(data['power'], Constants.Slot.TWO),
      ];
    }
    return Commands.movePower(data['power'], data['slot']);
  }


  /**
   * Rotates the motor for the given steps.
   * @param {!Object} data
   * @return {!ArrayBuffer}
   */
  ['moveSteps'](data) {
    if (data['slot'] === undefined) {
      return [
        Commands.moveSteps(-data['steps'], data['power'], Constants.Slot.ONE),
        Commands.moveSteps(data['steps'], data['power'], Constants.Slot.TWO),
      ];
    }
    return Commands.moveSteps(data['steps'], data['power'], data['slot']);
  }


  /**
   * Sets led light on the top of the mbot
   * @param {!Object} data
   * @return {!ArrayBuffer}
   */
  ['setRGBLED'](data) {
    return Commands.setRGBLED(
      data['red'], data['green'], data['blue'], data['index']);
  }


  /**
   * Plays a tone through mBot's buzzer
   * @param {!Object} data
   * @return {!ArrayBuffer}
   */
  ['playTone'](data) {
    return Commands.playTone(data['frequency'], data['duration']);
  }


  /**
   * Device version
   * @return {!ArrayBuffer}
   */
  ['getVersion']() {
    return Commands.getVersion();
  }


  /**
   * Reads out sensor value.
   * @param {!Object} data
   * @return {!ArrayBuffer}
   */
  ['getSensorData'](data) {
    return Commands.getSensorData(data['index'], data['device'], data['port']);
  }


  /**
   * Resets the mBot.
   * @return {!ArrayBuffer}
   */
  ['reset']() {
    return Commands.reset();
  }


  /**
   * Stops mBot.
   * @return {!ArrayBuffer}
   */
  ['stop']() {
    return [
      this['setRGBLED']({}),
      Commands.movePower(0, Constants.Slot.ONE),
      Commands.movePower(0, Constants.Slot.TWO),
      this['reset'](),
    ];
  }
}


exports = Handler;
