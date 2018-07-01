/**
 * @fileoverview ByteArray Buffer LSB tests.
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
goog.require('cwc.lib.utils.byte.array.BufferLSB');


goog.scope(function() {
const ByteBuffer = goog.module.get('cwc.lib.utils.byte.array.BufferLSB');

describe('ByteBuffer LSB', function() {
  it('writeShort', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.writeShort(0x00);
    byteBufferTest.writeShort(0x80);
    byteBufferTest.writeShort(0xFF);
    byteBufferTest.writeShort(0x200);
    byteBufferTest.writeShort(0x0020);
    byteBufferTest.writeShort(500);
    expect(byteBufferTest.get()[0]).toEqual(0x00);
    expect(byteBufferTest.get()[1]).toEqual(0x00);
    expect(byteBufferTest.get()[2]).toEqual(0x80);
    expect(byteBufferTest.get()[3]).toEqual(0x00);
    expect(byteBufferTest.get()[4]).toEqual(0xFF);
    expect(byteBufferTest.get()[5]).toEqual(0x00);
    expect(byteBufferTest.get()[6]).toEqual(0x00);
    expect(byteBufferTest.get()[7]).toEqual(0x02);
    expect(byteBufferTest.get()[8]).toEqual(0x20);
    expect(byteBufferTest.get()[9]).toEqual(0x00);
    expect(byteBufferTest.get()[10]).toEqual(0xF4);
    expect(byteBufferTest.get()[11]).toEqual(0x01);
  });

  it('writeLong', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.writeLong(128);
    byteBufferTest.writeLong(512);
    byteBufferTest.writeLong(1024);
    byteBufferTest.writeLong(1653465824);
    expect(byteBufferTest.get()[0]).toEqual(0x80);
    expect(byteBufferTest.get()[1]).toEqual(0x00);
    expect(byteBufferTest.get()[2]).toEqual(0x00);
    expect(byteBufferTest.get()[3]).toEqual(0x00);

    expect(byteBufferTest.get()[4]).toEqual(0x00);
    expect(byteBufferTest.get()[5]).toEqual(0x02);
    expect(byteBufferTest.get()[6]).toEqual(0x00);
    expect(byteBufferTest.get()[7]).toEqual(0x00);

    expect(byteBufferTest.get()[8]).toEqual(0x00);
    expect(byteBufferTest.get()[9]).toEqual(0x04);
    expect(byteBufferTest.get()[10]).toEqual(0x00);
    expect(byteBufferTest.get()[11]).toEqual(0x00);

    expect(byteBufferTest.get()[12]).toEqual(0xE0);
    expect(byteBufferTest.get()[13]).toEqual(0xE2);
    expect(byteBufferTest.get()[14]).toEqual(0x8D);
    expect(byteBufferTest.get()[15]).toEqual(0x62);
  });
});
});
