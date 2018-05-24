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
goog.provide('cwc.lib.protocol.Buffer');

goog.require('cwc.lib.protocol.BufferType');


/**
 * @constructor
 */
cwc.lib.protocol.Buffer = function() {
  /** @type {!Array} */
  this.data = [];

  /** @type {Object.<cwc.lib.protocol.BufferType|string|number>} */
  this.headers = {};
};


/**
 * Writes a byte into the buffer.
 * @param {number} value
 * @param {number=} defaultValue
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.writeByte = function(value,
    defaultValue = 0x00) {
  this.addHeader(cwc.lib.protocol.BufferType.BYTE);
  this.write(value === undefined ? defaultValue : value);
  return this;
};


/**
 * Writes null byte with 0x00.
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.writeNullByte = function() {
  this.writeByte(0x00);
  return this;
};


/**
 * Writes single byte with 0x01.
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.writeSingleByte = function() {
  this.writeByte(0x01);
  return this;
};


/**
 * Writes a short into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.writeShort = function(value) {
  this.addHeader(cwc.lib.protocol.BufferType.SHORT);
  this.write(value);
  this.write(value >> 8);
  return this;
};


/**
 * Writes an integer into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.writeInt = function(value) {
  this.addHeader(cwc.lib.protocol.BufferType.INT);
  this.write(value);
  this.write(value >> 8);
  this.write(value >> 16);
  this.write(value >> 24);
  return this;
};


/**
 * Writes an unsigned integer into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.writeUInt = function(value) {
  this.addHeader(cwc.lib.protocol.BufferType.UINT);
  this.write(value & 0xFF);
  return this;
};


/**
 * Writes an unsigned 16bit integer into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.writeUInt16 = function(value) {
  this.addHeader(cwc.lib.protocol.BufferType.UINT16);
  this.write(value >> 8);
  this.write(value & 0xFF);
  return this;
};


/**
 * Writes a string into the buffer.
 * @param {string} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.writeString = function(value) {
  this.addHeader(cwc.lib.protocol.BufferType.STR);
  let valueLength = value.length;
  for (let i = 0; i < valueLength; i++) {
    this.write(value.charCodeAt(i));
  }
  this.write(0x00);
  return this;
};


/**
 * @param {!Array|!string} command
 * @return {THIS}
 * @template THIS
 */
cwc.lib.protocol.Buffer.prototype.writeCommand = function(command) {
  if (command instanceof Array) {
    this.write(command[0]);
    this.write(command[1]);
  } else {
    this.write(command);
  }
  return this;
};


/**
 * Writes an index integer into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.writeIndex = function(value) {
  this.addHeader(cwc.lib.protocol.BufferType.INDEX);
  this.write(value || 0x00);
  return this;
};


/**
 * @param {string|number} data
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.lib.protocol.Buffer.prototype.write = function(data) {
  this.data.push(data);
  return this;
};


/**
 * @return {number}
 * @export
 */
cwc.lib.protocol.Buffer.prototype.length = function() {
  return this.data.length;
};


/**
 * @return {!Array}
 * @export
 */
cwc.lib.protocol.Buffer.prototype.getData = function() {
  return this.data;
};


/**
 * @export
 */
cwc.lib.protocol.Buffer.prototype.clearData = function() {
  this.data = [];
};


/**
 * @param {cwc.lib.protocol.BufferType} type
 * @export
 */
cwc.lib.protocol.Buffer.prototype.addHeader = function(type) {
  if (this.hasHeader(type)) {
    this.write(this.headers[type]);
  }
};


/**
 * @param {cwc.lib.protocol.BufferType} type
 * @param {string|number} data
 * @export
 */
cwc.lib.protocol.Buffer.prototype.setHeader = function(type, data) {
  this.headers[type] = data;
};


/**
 * @param {cwc.lib.protocol.BufferType} type
 * @return {boolean}
 * @export
 */
cwc.lib.protocol.Buffer.prototype.hasHeader = function(type) {
  if (type) {
    return this.headers[type] !== undefined;
  }
  return false;
};


/**
 * @param {cwc.lib.protocol.BufferType} type
 * @return {string|number}
 * @export
 */
cwc.lib.protocol.Buffer.prototype.getHeader = function(type) {
  return this.headers[type];
};
