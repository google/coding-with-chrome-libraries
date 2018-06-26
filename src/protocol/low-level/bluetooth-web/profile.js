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
goog.module('cwc.lib.protocol.bluetoothWeb.Profile');


/**
 * List of know charactersticis.
 * The default characteristric will be used as default for sending data.
 *
 * @enum {!Object.<!Object>}
 */
const Characteristic = {
  LEGO: {
    WEDO2: {
      default: '00001565-1212-efde-1523-785feabcd123',
      device: {
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
        format: '00001561-1212-efde-1523-785feabcd123',
        input: '00001563-1212-efde-1523-785feabcd123',
        output: '00001565-1212-efde-1523-785feabcd123',
        sensor: '00001560-1212-efde-1523-785feabcd123',
      },
    },
  },
  SPHERO: {
    default: '22bb746f-2ba1-7554-2d6f-726568705327',
    robotControl: {
      command: '22bb746f-2ba1-7554-2d6f-726568705327',
      response: '22bb746f-2ba6-7554-2d6f-726568705327',
    },
    spheroBLE: {
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
 * List of know devices with their charactersticis and services.
 *
 * @enum {!Object.<!Object>}
 */
const Device = {
  SPHERO_SPRK_PLUS: {
    name: 'Sphero SPRK+',
    namePrefix: 'SK-',
    icon: 'adjust',
    characteristic: Characteristic.SPHERO,
    services: {
      robotControl: '22bb746f-2ba0-7554-2d6f-726568705327',
      spheroBLE: '22bb746f-2bb0-7554-2d6f-726568705327',
    },
  },
  SPHERO_BB8: {
    name: 'Sphero BB-8',
    namePrefix: 'BB-',
    icon: 'adjust',
    characteristic: Characteristic.SPHERO,
    services: {
      robotControl: '22bb746f-2ba0-7554-2d6f-726568705327',
      spheroBLE: '22bb746f-2bb0-7554-2d6f-726568705327',
    },
  },
  SPHERO_OLLIE: {
    name: 'Sphero Ollie',
    namePrefix: '2B-',
    icon: 'adjust',
    characteristic: Characteristic.SPHERO,
    services: {
      robotControl: '22bb746f-2ba0-7554-2d6f-726568705327',
      spheroBLE: '22bb746f-2bb0-7554-2d6f-726568705327',
    },
  },
  LEGO_WEDO_2: {
    name: 'Lego WeDo 2.0',
    namePrefix: 'LPF2',
    characteristic: Characteristic.LEGO.WEDO2,
    services: {
      device: '00001523-1212-efde-1523-785feabcd123',
      control: '00004f0e-1212-efde-1523-785feabcd123',
    },
  },
/*
  SPHERO_MINI {
    namePrefix: 'SM-',
  },
*/
};


exports.Device = Device;
exports.Characteristic = Characteristic;
