/**
 * @fileoverview Lego WeDo 2.0 Communication buffer
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
goog.module('cwc.lib.protocol.lego.weDo2.Buffer');

const ByteArray = goog.require('cwc.lib.utils.byte.Array');


/**
 * @class
 */
class Buffer extends ByteArray.Buffer {
  /**
   *
   */
  constructor() {
    super();
  }


  /**
   * @param {number} channel 1-6
   * @return {THIS}
   * @template THIS
   */
  writeChannel(channel) {
    this.writeByte(channel);
    return this;
  }


  /**
   * @param {number} length
   * @return {THIS}
   * @template THIS
   */
  writeLength(length) {
    this.writeByte(length);
    return this;
  }


  /**
   * @return {!ArrayBuffer}
   */
  readSigned() {
    return this.getUint8Array();
  }
}


exports = Buffer;
