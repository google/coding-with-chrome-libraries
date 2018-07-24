/**
 * @fileoverview mBot Communication buffer
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
goog.module('cwc.lib.protocol.makeblock.mBot.Buffer');

const ByteArrayBuffer = goog.require('cwc.lib.utils.byte.array.BufferLSB');


/**
 * @class
 */
class Buffer extends ByteArrayBuffer {
  /**
   *
   */
  constructor() {
    super();

    /** @type {!Array} */
    this.header = [0xff, 0x55];
  }


  /**
   * @param {!cwc.protocol.makeblock.mBot.Device} device
   * @return {THIS}
   * @template THIS
   */
  writeDevice(device) {
    return this.writeByte(device);
  }


  /**
   * @param {!cwc.protocol.makeblock.mBot.CommandType} type
   * @return {THIS}
   * @template THIS
   */
  writeType(type) {
    return this.writeByte(type);
  }


  /**
   * @param {!cwc.protocol.makeblock.mBot.Port} port
   * @return {THIS}
   * @template THIS
   */
  writePort(port) {
    return this.writeByte(port);
  }


  /**
   * @param {!cwc.protocol.makeblock.mBot.CallbackType} index
   * @return {THIS}
   * @template THIS
   */
  writeCallback(index) {
    return this.writeByte(index);
  }


  /**
   * @return {!ArrayBuffer}
   */
  readSigned() {
    let buffer = this.get();
    let dataLength = buffer.length;
    let dataBuffer = new ArrayBuffer(dataLength + 3);
    let data = new Uint8Array(dataBuffer);
    data[0] = this.header[0];
    data[1] = this.header[1];
    data[2] = dataLength;
    for (let i = 0; i < dataLength; i++) {
      data[3 + i] = buffer[i];
    }
    return dataBuffer;
  }
}


exports = Buffer;
