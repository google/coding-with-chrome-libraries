/**
 * @fileoverview Command Handler for Sphero 2.0 implementation.
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
goog.module('cwc.lib.protocol.sphero.sphero2.Handler');

const Commands = goog.require('cwc.lib.protocol.sphero.sphero2.Commands');


/**
 * @class
 * @unrestricted
 */
class Handler {
  /**
   *
   */
  constructor() {
    /** @private {boolean} */
    this.calibrate_ = false;

    /** @private {number} */
    this.heading_ = 0;

    /** @private {number} */
    this.speed_ = 20;
  }


  /**
   * @param {!Object} data
   * @return {!ArrayBuffer}
   */
  ['boost'](data) {
    return Commands.boost(data['enable']);
  }


  /**
   * Starts the calibration to calibrate the Sphero.
   * @param {!Object} data
   * @return {!Array<ArrayBuffer>|ArrayBuffer}
   */
  ['calibrate'](data) {
    let cmds = [];
    if (!this.calibrate_) {
      cmds.push(this['setRGB']());
      cmds.push(this['setBackLed']({'brightness': 255}));
      this.calibrate_ = true;
    }
    cmds.push(this['roll']({'speed': 0, 'heading': data['heading']}));
    return cmds;
  }


  /**
   * Gets the current RGB color.
   * @return {!ArrayBuffer}
   */
  ['getRGB']() {
    return Commands.getRGB();
  }


  /**
   * Gets device information.
   * @return {!ArrayBuffer}
   */
  ['getDeviceInfo']() {
    return Commands.getDeviceInfo();
  }


  /**
   * Reads the current Sphero location.
   * @return {!ArrayBuffer}
   */
  ['getLocation']() {
    return Commands.getLocation();
  }


  /**
   * Reads current Sphero version.
   * @return {!ArrayBuffer}
   */
  ['getVersion']() {
    return Commands.getVersion();
  }


  /**
   * Rolls the robot with the given speed, heading and state.
   * @param {!Object} data
   * @return {!ArrayBuffer}
   */
  ['roll'](data) {
    let speed = this.speed_ = data['speed'] === undefined ?
      this.speed_ : data['speed'];
    let heading = this.heading_ = data['heading'] === undefined ?
      this.heading_ : data['heading'];
   return Commands.roll(speed, heading, data['state']);
  }


  /**
   * Stops the rolling of the robot.
   * @return {!ArrayBuffer}
   */
  ['rollStop']() {
    return Commands.roll(0, this.heading_, false);
  }


  /**
   * Sets the bridgthness of the back led.
   * @param {Object=} data
   * @return {!ArrayBuffer}
   */
  ['setBackLed'](data = {}) {
    return Commands.setBackLed(data['brightness']);
  }


  /**
   * Ends the calibrate of the Sphero and store the new 0 point.
   * @return {!Array<ArrayBuffer>|ArrayBuffer}
   */
  ['setCalibration']() {
    this.calibrate_ = false;
    return [
      this['setBackLed'](),
      this['setHeading'](),
    ];
  }


  /**
   * Enables Collision detection
   * @return {!ArrayBuffer}
   */
  ['setCollisionDetection']() {
    return Commands.setCollisionDetection();
  }


  /**
   * @param {Object=} data
   * @return {!ArrayBuffer}
   */
  ['setHeading'](data = {}) {
    return Commands.setHeading(data['heading']);
  }


  /**
   * @param {!Object} data
   * @return {!ArrayBuffer}
   */
  ['setMotionTimeout'](data) {
    return Commands.setMotionTimeout(data['timeout']);
  }


  /**
   * Sets the RGB color.
   * @param {Object=} data
   * @return {!ArrayBuffer}
   */
  ['setRGB'](data = {}) {
    return Commands.setRGB(
      data['red'], data['green'], data['blue'], data['persistent']);
  }


  /**
   * @param {Object=} data
   * @return {!ArrayBuffer}
   */
  ['setLocation'](data = {}) {
    return Commands.setLocation(
      data['flags'], data['x'], data['y'], data['yaw']);
  }


  /**
   * Puts the Sphero into sleep.
   * @param {Object=} data
   * @return {!ArrayBuffer}
   */
  ['sleep'](data = {}) {
    console.log('Sends Sphero to sleep, good night.');
    return Commands.sleep(data['wakeup'], data['macro'], data['orb_basic']);
  }


  /**
   * Stops the Sphero device.
   * @return {!Array<ArrayBuffer>}
   */
  ['stop']() {
    return [
      this['setRGB']({'persistent': true}),
      this['setBackLed'](),
      this['boost']({'enable': false}),
      this['rollStop'](),
    ];
  }
}


exports = Handler;
