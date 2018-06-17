/**
 * @fileoverview General-purpose binary buffer tests.
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
 *cwc.lib.protocol.Buffer
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.module('cwc.lib.protocol.BufferTest');
goog.setTestOnly('cwc.lib.protocol.BufferTest');

const Buffer = goog.require('cwc.lib.protocol.Buffer');
const BufferType = goog.require('cwc.lib.protocol.BufferType');


describe('buffer', function() {
  let byteHeader = Math.random();
  let indexHeader = Math.random();
  let integerHeader = Math.random();
  let shortHeader = Math.random();
  let stringHeader = Math.random();

  it('setHeader', function() {
    let buffer = new Buffer();
    buffer.setHeader(BufferType.BYTE, byteHeader);
    buffer.setHeader(BufferType.SHORT, shortHeader);
    buffer.setHeader(BufferType.INT, integerHeader);
    buffer.setHeader(BufferType.INDEX, indexHeader);
    buffer.setHeader(BufferType.STR, stringHeader);

    expect(buffer.getHeader(BufferType.BYTE))
      .toBe(byteHeader);
    expect(buffer.getHeader(BufferType.SHORT))
      .toBe(shortHeader);
    expect(buffer.getHeader(BufferType.INT))
      .toBe(integerHeader);
    expect(buffer.getHeader(BufferType.INDEX))
      .toBe(indexHeader);
    expect(buffer.getHeader(BufferType.STR))
      .toBe(stringHeader);
  });

  it('clearData', function() {
    let buffer = new Buffer();
    expect(buffer.getData()).toEqual([]);
    buffer.clearData();
    expect(buffer.getData()).toEqual([]);
  });
});
