/**
 * @fileoverview ByteArray Buffer tests.
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
goog.require('cwc.lib.utils.byte.Array');


goog.scope(function() {
const ByteBuffer = goog.module.get('cwc.lib.utils.byte.Array').Buffer;
const DataType = goog.module.get('cwc.lib.utils.byte.Array').DataType;

describe('byteBufferTest Buffer', function() {
  it('setHeader / getHeader', function() {
    let byteHeader = Math.random();
    let indexHeader = Math.random();
    let integerHeader = Math.random();
    let shortHeader = Math.random();
    let stringHeader = Math.random();
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.setHeader(DataType.BYTE, byteHeader);
    byteBufferTest.setHeader(DataType.SHORT, shortHeader);
    byteBufferTest.setHeader(DataType.INT, integerHeader);
    byteBufferTest.setHeader(DataType.INDEX, indexHeader);
    byteBufferTest.setHeader(DataType.STR, stringHeader);

    expect(byteBufferTest.getHeader(DataType.BYTE)).toBe(byteHeader);
    expect(byteBufferTest.getHeader(DataType.SHORT)).toBe(shortHeader);
    expect(byteBufferTest.getHeader(DataType.INT)).toBe(integerHeader);
    expect(byteBufferTest.getHeader(DataType.INDEX)).toBe(indexHeader);
    expect(byteBufferTest.getHeader(DataType.STR)).toBe(stringHeader);
  });

  it('clear', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.write('Hello World');
    expect(byteBufferTest.get()[0]).toEqual('Hello World');
    byteBufferTest.clear();
    expect(byteBufferTest.get()).toEqual([]);
  });

  it('get', function() {
    let value1 = Math.random();
    let value2 = Math.random();
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.write(value1);
    byteBufferTest.write(value2);
    expect(byteBufferTest.get()[0]).toEqual(value1);
    expect(byteBufferTest.get()[1]).toEqual(value2);
  });
});
});
