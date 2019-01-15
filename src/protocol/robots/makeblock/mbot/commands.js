/**
 * @fileoverview Byte commands for the mBot communication.
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
goog.module('cwc.lib.protocol.makeblock.mBot.Commands');

const Buffer = goog.require('cwc.lib.protocol.makeblock.mBot.Buffer');
const Constants = goog.require('cwc.lib.protocol.makeblock.mBot.Constants');


/**
 * Sets RGB LED color on the top of the mbot.
 * @param {number=} red 0-255
 * @param {number=} green 0-255
 * @param {number=} blue 0-255
 * @param {number=} index 0 for all lights; 1 for left, 2 for right
 * @return {!Buffer}
 */
exports.setRGBLED = function(red = 0, green = 0, blue = 0, index = 0x00) {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeType(Constants.CommandType.RUN)
    .writeDevice(Constants.Device.LEDLIGHT)
    .writePort(Constants.Port.LED_LIGHT)
    .writeByte(Constants.Slot.LED_LIGHT)
    .writeByte(index)
    .writeByte(red)
    .writeByte(green)
    .writeByte(blue);
};


/**
 * Plays a tone through mBot's buzzer
 * @param {number} frequency Frequency of the tone to play
 * @param {number=} duration Duration of the tone, in ms
 * @return {!Buffer}
 */
exports.playTone = function(frequency, duration = 500) {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeType(Constants.CommandType.RUN)
    .writeDevice(Constants.Device.BUZZER)
    .writeShort(frequency)
    .writeShort(duration);
};


/**
 * Sets motor power
 * @param {number} power (0-255)
 * @param {?cwc.protocol.makeblock.mBot.Port=} port
 * @return {!Buffer}
 */
exports.movePower = function(power, port = Constants.Port.RIGHT_MOTOR) {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeType(Constants.CommandType.RUN)
    .writeDevice(Constants.Device.DCMOTOR)
    .writePort(port)
    .writeShort(power);
};


/**
 * Reads out the sensor value.
 * @param {!Constants.CallbackType} callbackType
 * @param {!cwc.protocol.makeblock.mBot.Device} device
 * @param {!cwc.protocol.makeblock.mBot.Port} port
 * @return {!Buffer}
 */
exports.getSensorData = function(callbackType, device, port) {
  return new Buffer()
    .writeCallback(callbackType)
    .writeType(Constants.CommandType.GET)
    .writeDevice(device)
    .writePort(port);
};


/**
 * Gets current firmware version.
 * @return {!Buffer}
 */
exports.getVersion = function() {
  return new Buffer()
    .writeCallback(Constants.CallbackType.VERSION)
    .writeType(Constants.CommandType.GET)
    .writeDevice(Constants.Device.VERSION);
};


/**
 * Resets the mBot.
 * @return {!Buffer}
 */
exports.reset = function() {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeType(Constants.CommandType.RESET);
};


/**
 * Starts the mBot.
 * @return {!Buffer}
 */
exports.start = function() {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeType(Constants.CommandType.START);
};
