/**
 * @fileoverview List of known and supported Bluetooth LE devices.
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
goog.module('cwc.lib.protocol.bluetoothWeb.profile.Device');


/**
 * Lego Boost
 * @enum {!Object.<!Object>}
 */
exports.LEGO_BOOST = {
  name: 'Lego Boost',
  namePrefix: 'LEGO Move',
  service: {
    control: {
      _id_: '00001623-1212-efde-1623-785feabcd123',
      unknown: '00001624-1212-efde-1623-785feabcd123',
    },
  },
};


/**
 * Lego WeDo 2.0
 * @enum {!Object.<!Object>}
 */
exports.LEGO_WEDO2 = {
  name: 'Lego WeDo 2.0',
  namePrefix: 'LPF2',
  service: {
    device: {
      _id_: '00001523-1212-efde-1523-785feabcd123',
      alertHighCurrent: '00001529-1212-efde-1523-785feabcd123',
      alertLowSignal: '0000152a-1212-efde-1523-785feabcd123',
      alertLowVoltage: '00001528-1212-efde-1523-785feabcd123',
      battery: '0000152d-1212-efde-1523-785feabcd123',
      button: '00001526-1212-efde-1523-785feabcd123',
      disconnect: '0000152e-1212-efde-1523-785feabcd123',
      port: '00001527-1212-efde-1523-785feabcd123',
      sleep: '0000152b-1212-efde-1523-785feabcd123',
      vcc: '0000152c-1212-efde-1523-785feabcd123',
    },
    control: {
      _id_: '00004f0e-1212-efde-1523-785feabcd123',
      format: '00001561-1212-efde-1523-785feabcd123',
      input: '00001563-1212-efde-1523-785feabcd123',
      output: '00001565-1212-efde-1523-785feabcd123',
      sensor: '00001560-1212-efde-1523-785feabcd123',
    },
  },
};


/**
 * Sphero SPRK+
 * @enum {!Object.<!Object>}
 */
exports.SPHERO_SPRK_PLUS = {
  name: 'Sphero SPRK+',
  namePrefix: 'SK-',
  icon: 'adjust',
  service: {
    robotControl: {
      _id_: '22bb746f-2ba0-7554-2d6f-726568705327',
      command: '22bb746f-2ba1-7554-2d6f-726568705327',
      response: '22bb746f-2ba6-7554-2d6f-726568705327',
    },
    spheroBLE: {
      _id_: '22bb746f-2bb0-7554-2d6f-726568705327',
      antiDOS: '22bb746f-2bbd-7554-2d6f-726568705327',
      antiDOSTimeout: '22bb746f-2bbe-7554-2d6f-726568705327',
      rssi: '22bb746f-2bb6-7554-2d6f-726568705327',
      sleep: '22bb746f-2bb7-7554-2d6f-726568705327',
      txPower: '22bb746f-2bb2-7554-2d6f-726568705327',
      wake: '22bb746f-2bbf-7554-2d6f-726568705327',
    },
  },
};


/**
 * Sphero BB-
 * @enum {!Object.<!Object>}
 */
exports.SPHERO_BB8 = {
  name: 'Sphero BB-8',
  namePrefix: 'BB-',
  icon: 'adjust',
  service: exports.SPHERO_SPRK_PLUS.service,
};


/**
 * Spherp Ollie
 * @enum {!Object.<!Object>}
 */
exports.SPHERO_OLLIE = {
  name: 'Sphero Ollie',
  namePrefix: '2B-',
  icon: 'adjust',
  service: exports.SPHERO_SPRK_PLUS.service,
};


/**
 * Test device entry
 * @enum {!Object.<!Object>}
 */
exports.TEST_DEVICE = {
  name: 'Test Device',
  namePrefix: '',
  service: {
    serviceA: {
      _id_: 'Service-A',
      entry1: 'Characteristic 1',
      entry2: 'Characteristic 2',
      entry3: 'Characteristic 3',
    },
    serviceB: {
      _id_: 'Service-B',
      entry1: 'Characteristic 4',
      entry2: 'Characteristic 5',
      entry3: 'Characteristic 6',
    },
  },
};


/**
 * @return {Array}
 */
exports.LIST = [
  exports.LEGO_BOOST,
  exports.LEGO_WEDO2,
  exports.SPHERO_BB8,
  exports.SPHERO_OLLIE,
  exports.SPHERO_SPRK_PLUS,
];
