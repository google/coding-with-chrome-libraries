/**
 * @fileoverview Byte commands for the Sphero SPRK+ communication.
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
goog.module('cwc.lib.protocol.sphero.sprkPlus.Commands');

const Buffer = goog.require('cwc.lib.protocol.sphero.sprkPlus.Buffer');
const Constants = goog.require('cwc.lib.protocol.sphero.sprkPlus.Constants');

const defaultCharacteristic = '22bb746f-2ba1-7554-2d6f-726568705327';


/**
 * Sets RGB LED color.
 * @param {number=} red 0-255
 * @param {number=} green 0-255
 * @param {number=} blue 0-255
 * @param {boolean=} persistent
 * @return {!Buffer}
 */
exports.setRGB = function(red = 0, green = 0, blue = 0, persistent = false) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.RGB_LED.SET)
    .writeByte(red)
    .writeByte(green)
    .writeByte(blue)
    .writeByte(persistent == false ? 0x00 : 0x01);
};


/**
 * Gets current RGB LED color.
 * @return {!Buffer}
 */
exports.getRGB = function() {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCallback(Constants.CallbackType.RGB)
    .setCommand(Constants.Command.RGB_LED.GET);
};


/**
 * Gets basic device information.
 * @return {!Buffer}
 */
exports.getDeviceInfo = function() {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCallback(Constants.CallbackType.DEVICE_INFO)
    .setCommand(Constants.Command.SYSTEM.DEVICE_INFO);
};


/**
 * Sets back-light LED brightness.
 * @param {number=} brightness 0-255
 * @return {!Buffer}
 */
exports.setBackLed = function(brightness = 0) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.BACK_LED)
    .writeByte(brightness);
};


/**
 * Turns on or off the internal stabilization.
 * @param {boolean} enable
 * @return {!Buffer}
 */
exports.setStabilization = function(enable) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.STABILIZATION)
    .writeByte(enable ? 0x01 : 0x00);
};


/**
 * Sets heading.
 * @param {number=} heading 0-359
 * @return {!Buffer}
 */
exports.setHeading = function(heading = 0) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.HEADING)
    .writeShort(heading);
};


/**
 * Rolls the Sphero.
 * @param {number=} speed 0-255
 * @param {number=} heading 0-359
 * @param {boolean=} state
 * @return {!Buffer}
 */
exports.roll = function(speed = 50, heading = 0, state = undefined) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.ROLL)
    .writeByte(speed)
    .writeShort(heading)
    .writeByte(state === undefined ? 0x01 : (state ? 0x01 : 0x00));
};


/**
 * Sets collision detection.
 * @param {number=} method 0x00 to disable this service.
 * @param {number=} thresholdX left/right axes
 * @param {number=} thresholdY front/back axes
 * @param {number=} speedX
 * @param {number=} speedY
 * @param {number=} interval in 10msec
 * @return {!Buffer}
 */
exports.setCollisionDetection = function(method = 0x01,
    thresholdX = 0x40, thresholdY = 0x40, speedX = 0x40, speedY = 0x40,
    interval = 0x0A) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.COLLISION_DETECTION)
    .writeByte(method)
    .writeByte(thresholdX)
    .writeByte(thresholdY)
    .writeByte(speedX)
    .writeByte(speedY)
    .writeByte(interval);
};


/**
 * Configure locator.
 * @param {number=} flags 0x00 to disable automatic yaw tare correction.
 * @param {number=} x cordination
 * @param {number=} y cordination
 * @param {number=} yaw tare
 * @return {!Buffer}
 */
exports.setLocation = function(flags = 0x01, x = 0x00, y = 0x00, yaw = 0x00) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.LOCATION.SET)
    .writeByte(flags)
    .writeShort(x)
    .writeShort(y)
    .writeShort(yaw);
};


/**
 * Sets montion timeout.
 * @param {number} timeout in msec
 * @return {!Buffer}
 */
exports.setMotionTimeout = function(timeout) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.MOTION_TIMEOUT)
    .writeByte(timeout);
};


/**
 * @return {!Buffer}
 */
exports.enableDeloperMode = function() {
  return new Buffer()
    .setCharacteristic('22bb746f-2bbd-7554-2d6f-726568705327')
    .write(new TextEncoder('utf-8').encode('011i3'));
};


/**
 * @param {boolean=} enabled
 * @return {!Buffer}
 */
exports.boost = function(enabled = true) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.BOOST)
    .writeByte(enabled ? 0x01 : 0x00);
};


/**
 * Puts the Sphero into sleep.
 * @param {number=} wakeup
 * @param {number=} macro
 * @param {number=} orb_basic
 * @return {!Buffer}
 */
exports.sleep = function(wakeup = 0x00, macro = 0x00, orb_basic = 0x00) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCommand(Constants.Command.SYSTEM.SLEEP)
    .writeByte(wakeup)
    .writeByte(macro)
    .writeByte(orb_basic);
};


/**
 * Reads the current Sphero location.
 * @return {!Buffer}
 */
exports.getLocation = function() {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCallback(Constants.CallbackType.LOCATION)
    .setCommand(Constants.Command.LOCATION.GET);
};


/**
 * Reads current Sphero version.
 * @return {!Buffer}
 */
exports.getVersion = function() {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .setCallback(Constants.CallbackType.VERSION)
    .setCommand(Constants.Command.SYSTEM.VERSION);
};
