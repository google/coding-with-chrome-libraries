/**
 * @fileoverview Sphero 2.0 Communication buffer
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
goog.module('cwc.lib.protocol.sphero.sphero2.Buffer');

const ByteArrayBuffer = goog.require('cwc.lib.utils.byte.array.BufferMSB');


/**
 * @class
 */
class Buffer extends ByteArrayBuffer {
  /**
   *
   */
  constructor() {
    super();

    /** @type {!cwc.lib.protocol.sphero.sphero2.Constants.CallbackType} */
    this.callbackType = 0x00;

    /** @type {!cwc.lib.protocol.sphero.sphero2.Constants.Command|!Array} */
    this.command = [0x00, 0x01];
  }


  /**
   * @param {!cwc.lib.protocol.sphero.sphero2.Constants.CallbackType} callback
   * @return {THIS}
   * @template THIS
   */
  setCallback(callback) {
    this.callbackType = callback;
    return this;
  }


  /**
   * @param {!cwc.lib.protocol.sphero.sphero2.Constants.Command|!Array} command
   * @return {THIS}
   * @template THIS
   */
  setCommand(command) {
    this.command = command;
    return this;
  }

  /**
   * @return {!ArrayBuffer}
   */
  readSigned() {
    let buffer = this.get();
    let checkSum = 0;
    let dataLength = buffer.length + 1;
    let dataBuffer = new ArrayBuffer(dataLength + 6);
    let data = new Uint8Array(dataBuffer);
    data[0] = 0xFF;
    data[1] = this.callbackType ? 0xFF : 0xFE;
    data[2] = this.command[0];
    data[3] = this.command[1];
    data[4] = this.callbackType;
    data[5] = dataLength;
    checkSum += data[2] + data[3] + data[4] + data[5];
    for (let i = 0; i < dataLength; i++) {
      data[6 + i] = buffer[i] & 0xFF;
      checkSum += data[6 + i];
    }
    data[5 + dataLength] = checkSum & 0xFF ^ 0xFF;
    return dataBuffer;
  }
}


exports = Buffer;
