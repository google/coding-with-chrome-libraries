/**
 * @fileoverview ByteTools tests.
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

goog.require('cwc.lib.utils.byte.Tools');


goog.scope(function() {
const ByteTools = goog.module.get('cwc.lib.utils.byte.Tools');

describe('ByteTools', function() {
  it('bytesToInt', function() {
    expect(ByteTools.bytesToInt([0x00, 0x00])).toEqual(0);
    expect(ByteTools.bytesToInt([0x00, 0x01])).toEqual(1);
    expect(ByteTools.bytesToInt([0x00, 0xFF])).toEqual(255);
    expect(ByteTools.bytesToInt([0x01, 0x01])).toEqual(257);
    expect(ByteTools.bytesToInt([0xF0, 0x00])).toEqual(61440);
    expect(ByteTools.bytesToInt([0xFF, 0xFF])).toEqual(65535);
  });

  it('signedShortToInt', function() {
    expect(ByteTools.signedShortToInt([0x80, 0x00])).toBe(-32768);
    expect(ByteTools.signedShortToInt([0x80, 0x01])).toBe(-32767);
    expect(ByteTools.signedShortToInt([0xFF, 0xFF])).toBe(-1);
    expect(ByteTools.signedShortToInt([0x00, 0x00])).toBe(0);
    expect(ByteTools.signedShortToInt([0x00, 0x01])).toBe(1);
    expect(ByteTools.signedShortToInt([0x7F, 0xFE])).toBe(32766);
    expect(ByteTools.signedShortToInt([0x7F, 0xFF])).toBe(32767);
  });

  it('bytesToInt32', function() {
    expect(ByteTools.bytesToInt32(
      [0x0, 0x0, 0x00000000, 0x00000001])).toEqual(1);
    expect(ByteTools.bytesToInt32(
      [0x0, 0x0, 0x00000001, 0x00000000])).toEqual(256);
    expect(ByteTools.bytesToInt32(
      [0x0, 0x0, 0x00000001, 0x00000001])).toEqual(257);
    expect(ByteTools.bytesToInt32(
      [0x0, 0x0, 0x00000011, 0x00000001])).toEqual(4353);
    expect(ByteTools.bytesToInt32(
      [0x0, 0x0, 0x10101010, 0x10101010])).toEqual(538976272);
    expect(ByteTools.bytesToInt32(
      [0x0, 0x10101010, 0x0, 0x10101010])).toEqual(538972176);
    expect(ByteTools.bytesToInt32(
      [0x10101010, 0x0, 0x0, 0x10101010])).toEqual(537923600);
    expect(ByteTools.bytesToInt32(
      [0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF])).toEqual(4278124287);
  });

  it('isArrayBufferEqual', function() {
    let data1 = [255, 25, 0, 5, 6];
    let data2 = [255, 25, 1, 5, 6];
    let data3 = [255, 25, 1, 5, 6];
    let data4 = [255, 25, 1, 5];
    let data5 = [0, 0, 64, 64];
    let data6 = [0, 0, 0, 0];
    expect(ByteTools.isArrayBufferEqual(data1, data1)).toEqual(true);
    expect(ByteTools.isArrayBufferEqual(data1, data2)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data1, data3)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data1, data4)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data1, data5)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data1, data6)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data2, data1)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data2, data2)).toEqual(true);
    expect(ByteTools.isArrayBufferEqual(data2, data3)).toEqual(true);
    expect(ByteTools.isArrayBufferEqual(data2, data4)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data2, data4)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data2, data5)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data2, data6)).toEqual(false);
    expect(ByteTools.isArrayBufferEqual(data5, data5)).toEqual(true);
    expect(ByteTools.isArrayBufferEqual(data6, data6)).toEqual(true);
  });

  it('joinUint8Array', function() {
    let data1 = ByteTools.toUint8Array([0x10101010]);
    let data2 = ByteTools.toUint8Array([0x10101010]);
    let result = ByteTools.toUint8Array([0x10101010, 0x10101010]);
    expect(ByteTools.joinUint8Array(data1, data2)).toEqual(result);
  });

  it('getBytePositions', function() {
    let data = ByteTools.toUint8Array([255, 255, 0, 21, 4, 255, 254, 0, 231]);
    let data2 = ByteTools.toUint8Array([255, 255]);
    let data3 = ByteTools.toUint8Array([255, 255, 0, 21, 4, 255, 255, 0, 231]);
    let data4 = ByteTools.toUint8Array([255, 255, 0, 21, 4, 255, 255]);
    let header1 = [21];
    let header2 = [255, 255];
    let header3 = [255, 254];
    let header4 = [255, 253];
    let header5 = [0, 231];
    let header6 = [231];
    let header7 = [232];
    let header8 = [255, 254, 0];
    let header9 = [254, 0, 231];
    let header10 = [255, 255, 0];
    let header11 = [255, 255, 255];
    let header12 = [255, 255];
    let header13 = [255];
    expect(ByteTools.getBytePositions(data, header1)).toEqual([3]);
    expect(ByteTools.getBytePositions(data, header2)).toEqual([0]);
    expect(ByteTools.getBytePositions(data, header3)).toEqual([5]);
    expect(ByteTools.getBytePositions(data, header4)).toEqual(null);
    expect(ByteTools.getBytePositions(data, header5)).toEqual([7]);
    expect(ByteTools.getBytePositions(data, header6)).toEqual([8]);
    expect(ByteTools.getBytePositions(data, header7)).toEqual(null);
    expect(ByteTools.getBytePositions(data, header8)).toEqual([5]);
    expect(ByteTools.getBytePositions(data, header9)).toEqual([6]);
    expect(ByteTools.getBytePositions(data, header10)).toEqual([0]);
    expect(ByteTools.getBytePositions(data, header11)).toEqual(null);
    expect(ByteTools.getBytePositions(data2, header1)).toEqual(null);
    expect(ByteTools.getBytePositions(data2, header2)).toEqual([0]);
    expect(ByteTools.getBytePositions(data2, header11)).toEqual(null);
    expect(ByteTools.getBytePositions(data3, header6)).toEqual([8]);
    expect(ByteTools.getBytePositions(data3, header12)).toEqual([0, 5]);
    expect(ByteTools.getBytePositions(data3, header13)).toEqual([0, 1, 5, 6]);
    expect(ByteTools.getBytePositions(data4, header11)).toEqual(null);
  });

  it('getUint8Data', function() {
    let packet1 = ByteTools.toUint8Array(
      [255, 255, 0, 21, 4, 255, 0, 0, 231]);
    let packet1Shifted = ByteTools.toUint8Array(
      [0, 255, 0, 255, 255, 0, 21, 4, 255, 0, 0, 231]);
    let packet1Broken = ByteTools.toUint8Array(
      [255, 0, 21, 4, 255, 0, 0, 231]);
    let packet2 = ByteTools.toUint8Array(
      [255, 255, 0, 21, 4, 0, 255, 0, 231]);
    let packet3 = ByteTools.toUint8Array(
      [255, 255, 0, 21, 4, 0, 0, 255, 231]);
    let packet4 = ByteTools.toUint8Array(
      [255, 255, 0, 16, 11, 255, 250, 255, 252, 0, 0, 0, 0, 0, 0, 240]);
    let packet5 = ByteTools.toUint8Array(
      [255, 255, 0, 16, 11, 255, 253, 255, 250, 0, 24, 255, 247, 0, 25, 200]);
    let packet6 = ByteTools.toUint8Array(
      [255, 255, 0, 16, 11, 0, 4, 255, 235, 0, 0, 0, 0, 0, 0, 246]);
    let headers1 = [0xff, 0xff];
    let headers2 = [0xff, 0xfe];
    let size1 = 9;
    let size2 = 16;
    let buffer1 = ByteTools.toUint8Array([0, 255]);
    expect(ByteTools.getUint8Data(packet1).data)
      .toEqual(packet1);
    expect(ByteTools.getUint8Data(packet1, null, size1).data)
      .toEqual(packet1);
    expect(ByteTools.getUint8Data(packet1, headers1, size1).data)
      .toEqual(packet1);
    expect(ByteTools.getUint8Data(packet1, headers1, 8).data)
      .toEqual(packet1);
    expect(ByteTools.getUint8Data(packet1, headers1, 9).data)
      .toEqual(packet1);
    expect(ByteTools.getUint8Data(packet1, headers1, 10).data)
      .toEqual(undefined);
    expect(ByteTools.getUint8Data(packet1, headers2, size1).data)
      .toEqual(undefined);
    expect(ByteTools.getUint8Data(packet1Shifted, headers1, size1).data)
      .toEqual(packet1);
    expect(ByteTools.getUint8Data(packet1Shifted, headers1, size1, buffer1)
      .data)
      .toEqual(packet1);
    expect(ByteTools.getUint8Data(packet1Broken, headers1, size1).data)
      .toEqual(undefined);
    expect(ByteTools.getUint8Data(packet1Broken, headers1, size1).buffer)
      .toEqual(packet1Broken);
    expect(ByteTools.getUint8Data(packet1Broken, headers1, size1, buffer1)
      .data)
      .toEqual(packet1);
    expect(ByteTools.getUint8Data(packet2, headers1, size1).data)
      .toEqual(packet2);
    expect(ByteTools.getUint8Data(packet3, headers1, size1).data)
      .toEqual(packet3);
    expect(ByteTools.getUint8Data(packet4, headers1, size2).data)
      .toEqual(packet4);
    expect(ByteTools.getUint8Data(packet5, headers1, size2).data)
      .toEqual(packet5);
    expect(ByteTools.getUint8Data(packet6, headers1, size2).data)
      .toEqual(packet6);
  });
});
});
