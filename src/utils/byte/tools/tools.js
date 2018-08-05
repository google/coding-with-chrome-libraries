/**
 * @fileoverview General-purpose Byte Tools.
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
goog.module('cwc.lib.utils.byte.Tools');


/**
 * @param {Object} data
 * @return {number}
 */
exports.bytesToInt = function(data) {
  return ((data[0] & 0xFF) << 8) + (data[1] & 0xFF);
};


/**
 * @param {Object} data
 * @return {number}
 */
exports.signedShortToInt = function(data) {
  let result = exports.bytesToInt(data);
  return data[0] & 128 ? 0xffff0000 | result : result;
};


/**
 * @param {Object} data
 * @return {number}
 */
exports.bytesToInt32 = function(data) {
  return (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3];
};


/**
 * @param {Object} data
 * @return {number}
 */
exports.bytesToInt32Alternative = function(data) {
  let value = new Uint8Array([data[0], data[1], data[2], data[3]]);
  return Number(new Int32Array(value.buffer)[0]);
};


/**
 * @param {Object} data
 * @return {number}
 */
exports.bytesToFloat32 = function(data) {
  let value = new Uint8Array([data[0], data[1], data[2], data[3]]);
  return Number((new Float32Array(value.buffer)[0]));
};


/**
 * @param {!Array|string} data
 * @return {!Uint8Array}
 */
exports.toUint8Array = function(data) {
  let dataLength = data.length;
  let dataBuffer = new Uint8Array(dataLength);
  if (typeof data === 'string') {
    // Handle Strings
    for (let i=0; i < dataLength; i++) {
      dataBuffer[i] = data.charCodeAt(i);
    }
  } else {
    // Handle Arrays
    for (let i=0; i < dataLength; i++) {
      dataBuffer[i] = data[i];
    }
  }
  return dataBuffer;
};


/**
 * @param {!ArrayBuffer|Uint8Array} data
 * @return {string}
 */
exports.toString = function(data) {
  return (String.fromCharCode.apply(null, data)).replace(/\0/g, '').trim();
};


/**
 * @param {!ArrayBuffer|ArrayBufferView|Uint8Array} data
 * @return {string}
 */
exports.toUTF8 = function(data) {
  if (data) {
    return new TextDecoder('utf-8').decode(data).trim();
  }
  return '';
};


/**
  * @param {!ArrayBuffer|Array} data1
  * @param {!ArrayBuffer|Array} data2
  * @return {boolean}
  */
exports.isArrayBufferEqual = function(data1, data2) {
  if (data1.length != data2.length) {
    return false;
  }
  for (let i = 0; i != data1.length; i++) {
    if (data1[i] != data2[i]) {
      return false;
    }
  }
  return true;
};


/**
 * @param {Uint8Array} data1
 * @param {Uint8Array} data2
 * @return {!Uint8Array}
 */
exports.joinUint8Array = function(data1, data2) {
  if (!data1 || !data2) {
    return data1 || data2 || new Uint8Array(0);
  }
  let joinedArray = new Uint8Array(data1.length + data2.length);
  joinedArray.set(data1, 0);
  joinedArray.set(data2, data1.length);
  return joinedArray;
};


/**
 * @param {!ArrayBuffer|Uint8Array} data
 * @return {!Uint8Array}
 */
exports.getUint8Array = function(data) {
  if (data instanceof Uint8Array) {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  console.error('Unable to read:', data);
  return new Uint8Array(0);
};


/**
 * @param {ArrayBuffer|Uint8Array} data
 * @param {Array=} headers
 * @param {number=} size
 * @param {ArrayBuffer|Uint8Array=} buffer
 * @return {Object} with data and buffer
 */
exports.getUint8Data = function(data, headers, size, buffer) {
  // Prepare Data Buffer
  let dataArray = exports.getUint8Array(data);

  // Return the data if no further processing is needed.
  if (!headers && !size && !buffer) {
    return {
      'data': dataArray,
    };
  }

  // Join any existing buffer.
  if (buffer) {
    let dataFragment = exports.getUint8Array(buffer);
    dataArray = exports.joinUint8Array(dataFragment, dataArray);
  }

  // Check if data have at least min size.
  if (size && dataArray.length < size) {
    return {
      'buffer': dataArray,
    };
  }

  // Perform additional header checks.
  if (headers) {
    let dataHeaders = typeof headers[0] !== 'object' ? [headers] : headers;

    // Quick header search on first position.
    for (let header of dataHeaders) {
      if ((header[0] === dataArray[0]) &&
          (header[1] === undefined || header[1] === dataArray[1])) {
        return {
          'data': dataArray,
        };
      }
    }

    // Advanced header check on all position.
    for (let header of dataHeaders) {
      let headerPosition = exports.getBytePositions(dataArray, header);
      if (headerPosition) {
        if (headerPosition.length === 1) {
          return {
            'data': dataArray.slice(headerPosition[0]),
          };
        } else {
          return {
            'data': dataArray.slice(headerPosition[0], headerPosition[1]),
            'buffer': dataArray.slice(headerPosition[1]),
          };
        }
      }
    }
    return {
      'buffer': dataArray,
    };
  }

  return {
    'data': dataArray,
  };
};


/**
 * Returns the bytes position in the given data stream.
 * @param {Uint8Array|Array} data
 * @param {Array} bytes
 * @return {Array|null}
 */
exports.getBytePositions = function(data, bytes) {
  if (!data || !bytes) {
    return null;
  }
  let dataLength = data.length;
  let byteLength = bytes.length;
  let result = [];

  if (dataLength < byteLength) {
    return null;
  }

  for (let dataPos = 0; dataPos < dataLength; dataPos++) {
    if (data[dataPos] === bytes[0]) {
      let foundbytes = true;
      for (let bytePos = 0; bytePos < byteLength; bytePos++) {
        if (data[dataPos + bytePos] !== bytes[bytePos]) {
          foundbytes = false;
        }
      }
      if (foundbytes && dataPos + byteLength <= dataLength) {
        result.push(dataPos);
      }
    }
  }
  return result.length ? result : null;
};
