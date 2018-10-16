/**
 * @fileoverview Default devices.
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
goog.module('cwc.lib.protocol.Device');

const Logger = goog.require('cwc.lib.utils.log.Logger');
const EventTarget = goog.require('goog.events.EventTarget');


/**
 * @class
 */
class Device {
  /**
   *
   */
  constructor() {
    /** @type {string} */
    this.address = '';

    /** @type {boolean} */
    this.connected = false;

    /** @type {boolean} */
    this.prepared = false;

    /** @type {string} */
    this.name = 'Default Device';

    /** @type {boolean} */
    this.paired = false;

    /** @type {string} */
    this.id = '';

    /** @type {string} */
    this.type = '';

    /** @type {string} */
    this.icon = '';

    /** @type {!cwc.lib.protocol.bluetoothChrome.Profile.Device|
     *         !cwc.lib.protocol.bluetoothWeb.Profile.Device|
     *         !Object}
     */
    this.profile = {};

    /** @type {!cwc.utils.Logger} */
    this.log = new Logger(this.name);

    /** @type {!goog.events.EventTarget} */
    this.eventTarget = new EventTarget();

    /** @type {!goog.events.EventTarget} */
    this.externalEventTarget = new EventTarget();

    /** @private {!Object} */
    this.listener_ = {};
  }


  /**
   * Disconnects device.
   * @return {boolean}
   */
  disconnect() {
    this.connected = false;
    return this.connected;
  }


  /**
   * @param {string} address
   * @return {THIS}
   * @template THIS
   */
  setAddress(address) {
    this.address = address;
    return this;
  }


  /**
   * @return {string}
   */
  getAddress() {
    return this.address || '';
  }


  /**
   * @param {boolean} connected
   * @return {THIS}
   * @template THIS
   */
  setConnected(connected) {
    this.connected = connected;
    return this;
  }


  /**
   * @return {boolean}
   */
  isConnected() {
    return this.connected;
  }


  /**
   * @param {!goog.events.EventTarget} eventTarget
   * @return {THIS}
   * @template THIS
   */
  setEventTarget(eventTarget) {
    this.eventTarget = eventTarget;
    return this;
  }


  /**
   * @return {!goog.events.EventTarget}
   */
  getEventTarget() {
    if (!this.eventTarget) {
      this.eventTarget = new EventTarget();
    }
    return this.eventTarget;
  }


  /**
   * @param {!goog.events.EventTarget} eventTarget
   * @return {THIS}
   * @template THIS
   */
  setExternalEventTarget(eventTarget) {
    this.externalEventTarget = eventTarget;
    return this;
  }


  /**
   * @param {boolean} paired
   * @return {THIS}
   * @template THIS
   */
  setPaired(paired) {
    this.paired = paired;
    return this;
  }


  /**
   * @return {boolean}
   */
  isPaired() {
    return this.paired;
  }


  /**
   * @param {string} id
   * @return {THIS}
   * @template THIS
   */
  setId(id) {
    this.id = id;
    return this;
  }


  /**
   * @return {string}
   */
  getId() {
    return this.id || '';
  }


  /**
   * @param {string} name
   * @return {THIS}
   * @template THIS
   */
  setName(name) {
    this.name = name;
    return this;
  }


  /**
   * @return {string}
   */
  getName() {
    return this.name || '';
  }


  /**
   * @param {string} type
   * @return {THIS}
   * @template THIS
   */
  setType(type) {
    this.type = type;
    return this;
  }


  /**
   * @return {string}
   */
  getType() {
    return this.type || '';
  }


  /**
   * @param {!Object} profile
   * @return {THIS}
   * @template THIS
   */
  setProfile(profile) {
    this.profile = profile;
    if (!this.icon && profile.icon) {
      this.icon = profile.icon;
    }
    if (!this.type && profile.name) {
      this.type = profile.name;
    }
    return this;
  }


  /**
   * @return {!Object}
   */
  getProfile() {
    return this.profile || {};
  }


  /**
   * @param {string} icon
   * @return {THIS}
   * @template THIS
   */
  setIcon(icon) {
    this.icon = icon;
    return this;
  }


  /**
   * @return {string}
   */
  getIcon() {
    return this.icon || '';
  }


  /**
   * @param {string} name
   * @return {THIS}
   * @template THIS
   */
  setLogName(name) {
    this.log = new Logger(name);
    return this;
  }
}


exports = Device;
