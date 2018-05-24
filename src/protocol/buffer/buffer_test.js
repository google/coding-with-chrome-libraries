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
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.require('cwc.lib.protocol.Buffer');
goog.require('cwc.lib.protocol.BufferType');


describe('buffer', function() {
  let byteHeader = Math.random();
  let indexHeader = Math.random();
  let integerHeader = Math.random();
  let shortHeader = Math.random();
  let stringHeader = Math.random();

  it('opt_header', function() {
    let buffer = new cwc.lib.protocol.Buffer();
    buffer.setHeader(cwc.lib.protocol.BufferType.BYTE, byteHeader);
    buffer.setHeader(cwc.lib.protocol.BufferType.SHORT, shortHeader);
    buffer.setHeader(cwc.lib.protocol.BufferType.INT, integerHeader);
    buffer.setHeader(cwc.lib.protocol.BufferType.INDEX, indexHeader);
    buffer.setHeader(cwc.lib.protocol.BufferType.STR, stringHeader);

    expect(buffer.getHeader(cwc.lib.protocol.BufferType.BYTE))
      .toBe(byteHeader);
    expect(buffer.getHeader(cwc.lib.protocol.BufferType.SHORT))
      .toBe(shortHeader);
    expect(buffer.getHeader(cwc.lib.protocol.BufferType.INT))
      .toBe(integerHeader);
    expect(buffer.getHeader(cwc.lib.protocol.BufferType.INDEX))
      .toBe(indexHeader);
    expect(buffer.getHeader(cwc.lib.protocol.BufferType.STR))
      .toBe(stringHeader);
  });

  it('clearData', function() {
    let buffer = new cwc.lib.protocol.Buffer();
    expect(buffer.getData()).toEqual([]);
    buffer.clearData();
    expect(buffer.getData()).toEqual([]);
  });
});
