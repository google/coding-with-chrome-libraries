/**
 * @fileoverview Feature detection.
 *
 * This helper class provides shortcuts to get the different of UI elements.
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
goog.module('cwc.lib.utils.Feature');


/**
 * @return {boolean}
 */
exports.hasBluetooth = function() {
  return exports.getChromeFeature('bluetooth') ? true : false;
};


/**
 * @return {boolean}
 */
exports.hasBluetoothWeb = function() {
  return typeof navigator.bluetooth !== 'undefined';
};


/**
 * @return {boolean}
 */
exports.hasBluetoothWebLight = function() {
  return exports.isWindows() && exports.hasBluetoothWeb() ? true : false;
};


/**
 * @return {boolean}
 */
exports.isWindows = function() {
  return window.navigator.userAgent.toLowerCase().includes('windows');
};


/**
 * @param {string} name
 * @return {boolean|?Object|?Function}
 */
exports.getChromeFeature = function(name) {
  if (typeof chrome === 'undefined') {
    return false;
  }
  let feature = null;
  switch (name) {
    case 'bluetooth':
      feature = chrome.bluetooth;
      break;
  }
  return exports.getFeature(feature, 'chrome.' + name);
};


/**
 * @param {?Object|?Function} feature
 * @param {string=} name
 * @return {boolean|?Object|?Function}
 */
exports.getFeature = function(feature, name = '') {
  let result = false;
  try {
    if (typeof feature === 'object' || typeof feature === 'function') {
      result = feature;
    }
  } finally {
    if (name && !result) {
      console.warn('Feature', name, 'is unsupported!');
    }
  }
  return result;
};
