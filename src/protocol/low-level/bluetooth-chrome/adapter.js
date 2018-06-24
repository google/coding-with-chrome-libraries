/**
 * @fileoverview Bluetooth adapter constructor.
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
goog.module('cwc.lib.protocol.bluetoothChrome.Adapter');

const Events = goog.require('cwc.lib.protocol.bluetoothChrome.Events');
const Logger = goog.require('cwc.lib.utils.Logger');


/**
 * @class
 */
class Adapter {
  /**
   * @param {!goog.events.EventTarget} eventTarget
   */
  constructor(eventTarget) {
    /** @type {string} */
    this.name = 'Bluetooth Adapter';

    /** @type {string} */
    this.address = '';

    /** @type {boolean} */
    this.powered = false;

    /** @type {boolean} */
    this.available = false;

    /** @type {boolean} */
    this.discovering = false;

    /** @type {boolean} */
    this.prepared = false;

    /** @type {boolean|undefined} */
    this.enabled = undefined;

    /** @private {!goog.events.EventTarget} */
    this.eventTarget_ = eventTarget;

    /** @type {!cwc.utils.Logger} */
    this.log_ = new Logger(this.name);
  }


  /**
   * Prepare adapter listener.
   */
  prepare() {
    if (!this.prepared) {
      this.log_.info('Preparing ...');
      this.eventTarget_.dispatchEvent(
        Events.adapterState({enabled: false}));

      // Monitor adapter state
      chrome.bluetooth.onAdapterStateChanged.addListener(
        this.handleAdapterState_.bind(this));
      this.updateAdapterState();
      this.prepared = true;
    }
  }


  /**
   * Handle state changed event.
   */
  updateAdapterState() {
    chrome.bluetooth.getAdapterState(this.handleAdapterState_.bind(this));
  }


  /**
   * @param {?} info
   * @private
   */
  handleAdapterState_(info) {
    if (!info) {
      this.log_.error('Error receiving adapter state.');
      return;
    }
    this.address = info['address'];
    this.name = info['name'];
    this.powered = info['powered'];
    this.available = info['available'];
    this.discovering = info['discovering'];

    if (!this.address) {
      return;
    } else if (
        this.enabled == (this.available && this.powered && this.prepared)) {
      return;
    } else if (this.available && this.powered && !this.enabled) {
      this.log_.info('Enable adapter:', info);
      this.enabled = true;
    } else if (this.enabled && !this.prepared) {
      this.log_.info('Adapter is not prepared:', info);
      this.enabled = false;
    }

    this.eventTarget_.dispatchEvent(
      Events.adapterState({enabled: this.enabled}));
  }
}


exports = Adapter;
