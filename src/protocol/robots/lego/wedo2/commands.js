/**
 * @fileoverview Lego WeDo 2.0 Commands
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
goog.module('cwc.lib.protocol.lego.weDo2.Commands');

const Buffer = goog.require('cwc.lib.protocol.lego.weDo2.Buffer');
const Constants = goog.require('cwc.lib.protocol.lego.weDo2.Constants');

const defaultCharacteristic = '00001565-1212-efde-1523-785feabcd123';


/**
 * Plays a tone with the frequency and duration.
 * @param {number} frequency
 * @param {number=} duration
 * @return {!ArrayBuffer}
 */
exports.playTone = function(frequency, duration = 500) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .writeChannel(Constants.Channel.TONE)
    .writeByte(0x02)
    .writeLength(4)
    .writeShort(frequency)
    .writeShort(duration);
};


/**
 * Sets RGB pre-defined color.
 * @param {number=} color 1-9 (0 = off)
 * @return {!ArrayBuffer}
 */
exports.setRGB = function(color = 0) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .writeChannel(Constants.Channel.RGB)
    .writeByte(0x04)
    .writeLength(1)
    .writeByte(color);
};


/**
 * Sets motor power
 * @param {number} power 0-127 forwward / 255 - 127 backwards
 * @param {!Constants.Channel.PORT1|Constants.Channel.PORT2} port
 * @return {!ArrayBuffer}
 */
exports.movePower = function(power, port = Constants.Channel.PORT1) {
  return new Buffer()
    .setCharacteristic(defaultCharacteristic)
    .writeChannel(port)
    .writeByte(0x01)
    .writeLength(1)
    .writeByte(power);
};


/**
 * @param {!Constants.Channel.PORT1|Constants.Channel.PORT2} port
 * @param {!Constants.Device.GYROSCOPE|Constants.Device.MOTION} type
 * @param {number=} mode (0x00 or 0x01)
 * @return {!ArrayBuffer}
 */
exports.setSensorMode = function(port, type, mode = 0x00) {
  return new Buffer()
    .setCharacteristic('00001563-1212-efde-1523-785feabcd123')
    .writeByte(0x01)
    .writeByte(0x02)
    .writeChannel(port)
    .writeByte(type)
    .writeByte(mode)
    .writeByte(0x01)
    .writeByte(0x00)
    .writeByte(0x00)
    .writeByte(0x00)
    .writeByte(0x02)
    .writeByte(0x01);
};
