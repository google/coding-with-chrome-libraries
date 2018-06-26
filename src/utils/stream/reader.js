/**
 * @fileoverview Stream Reader Tools.
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
goog.module('cwc.lib.utils.stream.Reader');

const ByteTools = goog.require('cwc.lib.utils.byte.Tools');


/**
 * @class
 */
class Reader {
  /**
   *
   */
  constructor() {
    /** @type {Array} */
    this.footer = null;

    /** @type {Array} */
    this.headers = null;

    /** @type {number} */
    this.minSize = 0;

    /** @private {Uint8Array} */
    this.buffer_ = null;

    /** @private {Function} */
    this.checksum_ = null;
  }


  /**
   * @param {!Function} checksum
   * @return {THIS}
   * @template THIS
   */
  setChecksum(checksum) {
    this.checksum_ = checksum;
    return this;
  }


  /**
   * @param {!Array} footer
   * @return {THIS}
   * @template THIS
   */
  setFooter(footer) {
    this.footer = footer;
    return this;
  }


  /**
   * @param {!Array} headers
   * @return {THIS}
   * @template THIS
   * @export
   */
  setHeaders(headers) {
    this.headers = typeof headers[0] !== 'object' ? [headers] : headers;
    return this;
  }


  /**
   * @param {number} size
   * @return {THIS}
   * @template THIS
   * @export
   */
  setMinimumSize(size) {
    this.minSize = size;
    return this;
  }


  /**
   * @param {Uint8Array} buffer
   */
  addBuffer(buffer) {
    this.buffer_ = ByteTools.joinUint8Array(this.buffer_, buffer);
  }


  /**
   * Read stream by header and footer.
   * @param {!Uint8Array} data
   * @return {Array.<Uint8Array>}
   */
  readByHeaderAndFooter(data) {
    let result = [];
    let dataBuffer = this.readByHeader(data);

    // Validate packet by footer to avoid fragments
    let endPosition = ByteTools.getBytePositions(dataBuffer, this.footer);
    if (endPosition) {
      for (let i = 0, len = endPosition.length; i < len; i++) {
        let fragment = dataBuffer.slice(
          i === 0 ? 0 : endPosition[i-1] + 2,
          endPosition[i]
        );

        if (fragment.length >= this.minSize) {
          result.push(fragment);

        // Only add last fragment to buffer.
        } else if (i+1 === len) {
          this.addBuffer(fragment);
        }
      }
    } else {
      this.addBuffer(dataBuffer);
      return null;
    }
    return result;
  }


  /**
   * Read stream by header.
   * @param {!Uint8Array} data
   * @return {Uint8Array}
   */
  readByHeader(data) {
    return this.read(data);
  }


  /**
   * Read stream.
   * @param {!Uint8Array} data
   * @return {Uint8Array}
   */
  read(data) {
    let buffer = ByteTools.getUint8Data(
      data, this.headers, this.minSize, this.buffer_);
    let dataBuffer = buffer['data'];
    this.buffer_ = buffer['buffer'];

    // Simple packet validation.
    if (!dataBuffer) {
      return null;
    } else if (dataBuffer.length < this.minSize) {
      this.addBuffer(dataBuffer);
      return null;
    }

    // Checksum validation.
    if (this.checksum_ && !this.checksum_(dataBuffer)) {
      this.addBuffer(dataBuffer);
      return null;
    }

    return dataBuffer;
  }
}


exports = Reader;
