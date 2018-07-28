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
goog.module('cwc.lib.protocol.makeblock.mBotRanger.Commands');

const Buffer = goog.require('cwc.lib.protocol.makeblock.mBotRanger.Buffer');
const Constants =
  goog.require('cwc.lib.protocol.makeblock.mBotRanger.Constants');


/**
 * Sets RGB LED color on the top of the mbot.
 * @param {number} red 0-255
 * @param {number} green 0-255
 * @param {number} blue 0-255
 * @param {number=} index 0 or 1 - 12
 * @return {!cwc.lib.protocol.makeblock.mBotRanger.Buffer}
 */
exports.setRGBLED = function(red = 0, green = 0, blue = 0, index = 0x00) {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeAction(Constants.Action.RUN)
    .writeDevice(Constants.Device.RGBLED)
    .writePort(Constants.Port.AUTO)
    .writeSlot(Constants.Slot.AUTO)
    .writeByte(index)
    .writeByte(red)
    .writeByte(green)
    .writeByte(blue);
};


/**
 * Plays a tone through mBot's buzzer
 * @param {number} frequency Frequency of the tone to play
 * @param {number} duration Duration of the tone, in ms
 * @return {!cwc.lib.protocol.makeblock.mBotRanger.Buffer}
 */
exports.playTone = function(frequency, duration = 500) {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeAction(Constants.Action.RUN)
    .writeDevice(Constants.Device.TONE)
    .writePort(Constants.Port.TONE)
    .writeShort(frequency)
    .writeShort(duration);
};


/**
 * Sets motor power
 * @param {number} power (0-255)
 * @param {Constants.Slot=} slot
 * @return {!cwc.lib.protocol.makeblock.mBotRanger.Buffer}
 */
exports.movePower = function(power, slot = Constants.Slot.ONE) {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeAction(Constants.Action.RUN)
    .writeDevice(Constants.Device.ENCODER_BOARD)
    .writePort(Constants.Port.ENCODER_BOARD_SPEED)
    .writeSlot(slot)
    .writeShort(power);
};


/**
 * Rotates the motor for the given steps.
 * @param {number} steps (−32768 - 32.767)
 * @param {number=} power (0-255)
 * @param {Constants.Slot=} slot
 * @return {!cwc.lib.protocol.makeblock.mBotRanger.Buffer}
 */
exports.moveSteps = function(steps, power = 130, slot = Constants.Slot.ONE) {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeAction(Constants.Action.RUN)
    .writeDevice(Constants.Device.ENCODER_BOARD)
    .writePort(Constants.Port.ENCODER_BOARD_POS)
    .writeSlot(slot)
    .writeInt(steps)
    .writeShort(power);
};


/**
 * Reads out the sensor value.
 * @param {!Constants.IndexType} indexType
 * @param {!Constants.Device} device
 * @param {!Constants.Port} port
 * @return {!cwc.lib.protocol.makeblock.mBotRanger.Buffer}
 */
exports.getSensorData = function(indexType, device, port) {
  return new Buffer()
    .writeCallback(indexType)
    .writeAction(Constants.Action.GET)
    .writeDevice(device)
    .writePort(port);
};


/**
 * Gets current firmware version.
 * @return {!cwc.lib.protocol.makeblock.mBotRanger.Buffer}
 */
exports.getVersion = function() {
  return new Buffer()
    .writeCallback(Constants.CallbackType.VERSION)
    .writeAction(Constants.Action.GET)
    .writeDevice(Constants.Device.VERSION);
};


/**
 * Resets the mBot.
 * @return {!cwc.lib.protocol.makeblock.mBotRanger.Buffer}
 */
exports.reset = function() {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeAction(Constants.Action.RESET);
};


/**
 * Starts the mBot.
 * @return {!cwc.lib.protocol.makeblock.mBotRanger.Buffer}
 */
exports.start = function() {
  return new Buffer()
    .writeCallback(Constants.CallbackType.NONE)
    .writeAction(Constants.Action.START);
};
