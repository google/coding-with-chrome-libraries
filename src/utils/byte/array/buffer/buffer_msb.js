/**
 * @fileoverview General-purpose ByteArray (big endian).
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
goog.module('cwc.lib.utils.byte.array.BufferMSB');

const ByteArrayBuffer = goog.require('cwc.lib.utils.byte.array.Buffer');
const DataType = goog.require('cwc.lib.utils.byte.array.DataType');


/**
 * ByteArray class with meta data support.
 * @class
 */
class BufferMSB extends ByteArrayBuffer {
  /**
   *
   */
  constructor() {
    super();
  }


  /**
   * Writes a short into the buffer.
   * @param {number} value
   * @return {THIS}
   * @template THIS
   */
  writeShort(value) {
    this.addHeader(DataType.SHORT);
    this.write(value >> 8 & 0xFF);
    this.write(value & 0xFF);
    return this;
  }


  /**
   * Writes a long into the buffer.
   * @param {number} value
   * @return {THIS}
   * @template THIS
   */
  writeLong(value) {
    this.addHeader(DataType.LONG);
    this.write(value >> 24 & 0xFF);
    this.write(value >> 16 & 0xFF);
    this.write(value >> 8 & 0xFF);
    this.write(value & 0xFF);
    return this;
  }


  /**
   * Writes a string into the buffer.
   * @param {string} value
   * @return {THIS}
   * @template THIS
   */
  writeString(value) {
    this.addHeader(DataType.STR);
    let valueLength = value.length;
    for (let i = 0; i < valueLength; i++) {
      this.write(value.charCodeAt(i));
    }
    this.write(0x00);
    return this;
  }
}


exports = BufferMSB;
