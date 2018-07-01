/**
 * @fileoverview List of known and supported Bluetooth LE devices tests.
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
goog.require('cwc.lib.protocol.bluetoothWeb.profile.Device');


goog.scope(function() {
const Device = goog.module.get('cwc.lib.protocol.bluetoothWeb.profile.Device');

describe('Device Profile', function() {
  it('Test device', function() {
    let testDevice = Device.TEST_DEVICE;
    expect(typeof testDevice).toEqual('object');
    expect(testDevice.name).toEqual('Test Device');
    expect(testDevice.service.serviceA._id_).toEqual('Service-A');
    expect(testDevice.service.serviceA.entry1).toEqual('Characteristic 1');
    expect(testDevice.service.serviceA.entry2).toEqual('Characteristic 2');
    expect(testDevice.service.serviceA.entry3).toEqual('Characteristic 3');
  });
});
});
