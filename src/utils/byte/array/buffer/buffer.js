/**
 * @fileoverview General-purpose ArrayBuffer.
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
goog.module('cwc.lib.utils.byte.array.Buffer');

const DataType = goog.require('cwc.lib.utils.byte.array.DataType');


/**
 * ByteArray class with meta data support.
 * @class
 */
class Buffer {
  /**
   *
   */
  constructor() {
    /** @type {!Array} */
    this.data = [];

    /** @type {Object.<DataType|string|number>} */
    this.headers = {};

    /** @type {Object.<string|number>} */
    this.meta = {};
  }


  /**
   * @param {string|number} data
   * @return {THIS}
   * @template THIS
   */
  write(data) {
    this.data.push(data);
    return this;
  }


  /**
   * Writes a byte into the buffer.
   * @param {number} value
   * @param {number=} defaultValue
   * @return {THIS}
   * @template THIS
   */
  writeByte(value, defaultValue = 0x00) {
    this.addHeader(DataType.BYTE);
    this.write(value === undefined ? defaultValue : value & 0xFF);
    return this;
  }


  /**
   * Writes null byte with 0x00.
   * @return {THIS}
   * @template THIS
   */
  writeNullByte() {
    this.addHeader(DataType.BYTE);
    this.write(0x00);
    return this;
  }


  /**
   * Writes single byte with 0x01.
   * @return {THIS}
   * @template THIS
   */
  writeSingleByte() {
    this.addHeader(DataType.BYTE);
    this.write(0x01);
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
   */
  writeIndex(value) {
    this.addHeader(DataType.INDEX);
    this.write(value || 0x00);
    return this;
  }


  /**
   * @return {number}
   */
  length() {
    return this.data.length;
  }


  /**
   * @return {!Array}
   */
  get() {
    return this.data;
  }


  /**
   * @return {!Uint8Array}
   */
  getUint8Array() {
    return new Uint8Array(this.data);
  }


  /**
   * Clears data and meta-data;
   */
  clear() {
    this.data = [];
    this.meta = {};
  }


  /**
   * @param {DataType} type
   */
  addHeader(type) {
    if (this.hasHeader(type)) {
      this.write(this.headers[type]);
    }
  }


  /**
   * @param {DataType} type
   * @param {string|number} data
   */
  setHeader(type, data) {
    this.headers[type] = data;
  }


  /**
   * @param {DataType} type
   * @return {boolean}
   */
  hasHeader(type) {
    if (typeof this.headers[type] !== 'undefined') {
      return true;
    }
    return false;
  }


  /**
   * @param {DataType} type
   * @return {string|number}
   */
  getHeader(type) {
    return this.headers[type];
  }


  /**
   * @param {string} characteristic
   * @return {THIS}
   * @template THIS
   */
  setCharacteristic(characteristic) {
    this.meta['characteristic'] = characteristic;
    return this;
  }


  /**
   * @return {string}
   */
  getCharacteristic() {
    return this.meta['characteristic'];
  }
}

exports = Buffer;
