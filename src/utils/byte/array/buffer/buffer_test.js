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
goog.require('cwc.lib.utils.byte.array.Buffer');


goog.scope(function() {
const ByteBuffer = goog.module.get('cwc.lib.utils.byte.array.Buffer');
const DataType = goog.module.get('cwc.lib.utils.byte.array.DataType');

describe('ByteBuffer', function() {
  it('constructor', function() {
    let byteBufferTest = new ByteBuffer();
    expect(typeof byteBufferTest).toEqual('object');
  });

  it('write', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.write(0x00);
    byteBufferTest.write(0x80);
    byteBufferTest.write(0xFF);
    byteBufferTest.write(0x200);
    byteBufferTest.write(0x122);
    expect(byteBufferTest.get()[0]).toEqual(0x00);
    expect(byteBufferTest.get()[1]).toEqual(0x80);
    expect(byteBufferTest.get()[2]).toEqual(0xFF);
    expect(byteBufferTest.get()[3]).toEqual(0x200);
    expect(byteBufferTest.get()[4]).toEqual(0x122);
  });

  it('writeByte', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.writeByte(0x00);
    byteBufferTest.writeByte(0x80);
    byteBufferTest.writeByte(0xFF);
    byteBufferTest.writeByte(0x200);
    byteBufferTest.writeByte(0x122);
    byteBufferTest.writeByte(undefined, 0x23);
    expect(byteBufferTest.get()[0]).toEqual(0x00);
    expect(byteBufferTest.get()[1]).toEqual(0x80);
    expect(byteBufferTest.get()[2]).toEqual(0xFF);
    expect(byteBufferTest.get()[3]).toEqual(0x00);
    expect(byteBufferTest.get()[4]).toEqual(0x22);
    expect(byteBufferTest.get()[5]).toEqual(0x23);
  });

  it('writeNullByte', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.writeNullByte();
    expect(byteBufferTest.get()[0]).toEqual(0x00);
  });

  it('writeSingleByte', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.writeSingleByte();
    expect(byteBufferTest.get()[0]).toEqual(0x01);
  });

  it('writeCommand', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.writeCommand(0x01);
    byteBufferTest.writeCommand([0x02, 0x03]);
    expect(byteBufferTest.get()[0]).toEqual(0x01);
    expect(byteBufferTest.get()[1]).toEqual(0x02);
    expect(byteBufferTest.get()[2]).toEqual(0x03);
  });

  it('writeIndex', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.writeIndex();
    byteBufferTest.writeIndex(0x10);
    expect(byteBufferTest.get()[0]).toEqual(0x00);
    expect(byteBufferTest.get()[1]).toEqual(0x10);
  });

  it('length', function() {
    let byteBufferTest = new ByteBuffer();
    expect(byteBufferTest.length()).toEqual(0);
    byteBufferTest.write(0x01);
    expect(byteBufferTest.length()).toEqual(1);
    byteBufferTest.write(0x01);
    expect(byteBufferTest.length()).toEqual(2);
  });

  it('setCharacteristic / getCharacteristic', function() {
    let value = Math.random();
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.setCharacteristic(value);
    expect(byteBufferTest.getCharacteristic()).toEqual(value);
  });

  it('setHeader', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.setHeader(DataType.BYTE, 0x00);
    byteBufferTest.setHeader(DataType.SHORT, 0x00);
    byteBufferTest.setHeader(DataType.LONG, 0x01);
    byteBufferTest.setHeader(DataType.DOUBLE, 0x00);
    byteBufferTest.setHeader(DataType.INDEX, 0x02);
    byteBufferTest.setHeader(DataType.STR, 0x00);
  });

  it('getHeader', function() {
    let byteHeader = Math.random();
    let indexHeader = Math.random();
    let longHeader = Math.random();
    let shortHeader = Math.random();
    let stringHeader = Math.random();
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.setHeader(DataType.BYTE, byteHeader);
    byteBufferTest.setHeader(DataType.SHORT, shortHeader);
    byteBufferTest.setHeader(DataType.LONG, longHeader);
    byteBufferTest.setHeader(DataType.INDEX, indexHeader);
    byteBufferTest.setHeader(DataType.STR, stringHeader);
    expect(byteBufferTest.getHeader(DataType.BYTE)).toBe(byteHeader);
    expect(byteBufferTest.getHeader(DataType.SHORT)).toBe(shortHeader);
    expect(byteBufferTest.getHeader(DataType.LONG)).toBe(longHeader);
    expect(byteBufferTest.getHeader(DataType.INDEX)).toBe(indexHeader);
    expect(byteBufferTest.getHeader(DataType.STR)).toBe(stringHeader);
  });

  it('hasHeader', function() {
    let byteBufferTest = new ByteBuffer();
    byteBufferTest.setHeader(DataType.BYTE, 0x00);
    byteBufferTest.setHeader(DataType.SHORT, 0x00);
    byteBufferTest.setHeader(DataType.LONG, 0x01);
    byteBufferTest.setHeader(DataType.INDEX, 0x02);
    byteBufferTest.setHeader(DataType.STR, 0x00);
    expect(byteBufferTest.hasHeader(DataType.BYTE)).toBe(true);
    expect(byteBufferTest.hasHeader(DataType.SHORT)).toBe(true);
    expect(byteBufferTest.hasHeader(DataType.LONG)).toBe(true);
    expect(byteBufferTest.hasHeader(DataType.INDEX)).toBe(true);
    expect(byteBufferTest.hasHeader(DataType.STR)).toBe(true);
    expect(byteBufferTest.hasHeader()).toBe(false);
    expect(byteBufferTest.hasHeader('NONE_EXISTS')).toBe(false);
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
