/**
 * @fileoverview General-purpose binary buffer.
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
goog.module('cwc.lib.protocol.Buffer');

const BufferType = goog.module.get('cwc.lib.protocol.BufferType');


/**
 * @class
 */
class Buffer {
  /**
   * @param {Array=} data
   */
  constructor(data) {
    /** @type {!Array} */
    this.data = data || [];

    /** @type {Object.<BufferType|string|number>} */
    this.headers = {};
  }

  /**
   * Writes a byte into the buffer.
   * @param {number} value
   * @param {number=} defaultValue
   * @return {THIS}
   * @template THIS
   */
  writeByte(value, defaultValue = 0x00) {
    this.addHeader(BufferType.BYTE);
    this.write(value === undefined ? defaultValue : value);
    return this;
  }

  /**
   * Writes null byte with 0x00.
   * @return {THIS}
   * @template THIS
   * @export
   */
  writeNullByte() {
    this.writeByte(0x00);
    return this;
  }


  /**
   * Writes single byte with 0x01.
   * @return {THIS}
   * @template THIS
   * @export
   */
  writeSingleByte() {
    this.writeByte(0x01);
    return this;
  }


  /**
   * Writes a short into the buffer.
   * @param {number} value
   * @return {THIS}
   * @template THIS
   * @export
   */
  writeShort(value) {
    this.addHeader(BufferType.SHORT);
    this.write(value);
    this.write(value >> 8);
    return this;
  }


  /**
   * Writes an integer into the buffer.
   * @param {number} value
   * @return {THIS}
   * @template THIS
   * @export
   */
  writeInt(value) {
    this.addHeader(BufferType.INT);
    this.write(value);
    this.write(value >> 8);
    this.write(value >> 16);
    this.write(value >> 24);
    return this;
  }


  /**
   * Writes an unsigned integer into the buffer.
   * @param {number} value
   * @return {THIS}
   * @template THIS
   * @export
   */
  writeUInt(value) {
    this.addHeader(BufferType.UINT);
    this.write(value & 0xFF);
    return this;
  }


  /**
   * Writes an unsigned 16bit integer into the buffer.
   * @param {number} value
   * @return {THIS}
   * @template THIS
   * @export
   */
  writeUInt16(value) {
    this.addHeader(BufferType.UINT16);
    this.write(value >> 8);
    this.write(value & 0xFF);
    return this;
  }


  /**
   * Writes a string into the buffer.
   * @param {string} value
   * @return {THIS}
   * @template THIS
   * @export
   */
  writeString(value) {
    this.addHeader(BufferType.STR);
    let valueLength = value.length;
    for (let i = 0; i < valueLength; i++) {
      this.write(value.charCodeAt(i));
    }
    this.write(0x00);
    return this;
  }


  /**
   * @param {!Array|!string} command
   * @return {THIS}
   * @template THIS
   */
  writeCommand(command) {
    if (command instanceof Array) {
      this.write(command[0]);
      this.write(command[1]);
    } else {
      this.write(command);
    }
    return this;
  }


  /**
   * Writes an index integer into the buffer.
   * @param {number} value
   * @return {THIS}
   * @template THIS
   * @export
   */
  writeIndex(value) {
    this.addHeader(BufferType.INDEX);
    this.write(value || 0x00);
    return this;
  }


  /**
   * @param {string|number} data
   * @return {THIS}
   * @template THIS
   * @export
   */
  write(data) {
    this.data.push(data);
    return this;
  }


  /**
   * @return {number}
   * @export
   */
  length() {
    return this.data.length;
  }


  /**
   * @return {!Array}
   * @export
   */
  getData() {
    return this.data;
  }


  /**
   * @export
   */
  clearData() {
    this.data = [];
  }


  /**
   * @param {BufferType} type
   * @export
   */
  addHeader(type) {
    if (this.hasHeader(type)) {
      this.write(this.headers[type]);
    }
  }


  /**
   * @param {BufferType} type
   * @param {string|number} data
   * @return {THIS}
   * @template THIS
   * @export
   */
  setHeader(type, data) {
    this.headers[type] = data;
    return this;
  }


  /**
   * @param {BufferType} type
   * @return {boolean}
   * @export
   */
  hasHeader(type) {
    if (type) {
      return this.headers[type] !== undefined;
    }
    return false;
  }


  /**
   * @param {BufferType} type
   * @return {string|number}
   * @export
   */
  getHeader(type) {
    return this.headers[type];
  }
}


exports = Buffer;
