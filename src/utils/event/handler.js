/**
 * @fileoverview Event Handler.
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
goog.module('cwc.lib.utils.event.Handler');

const Logger = goog.require('cwc.lib.utils.log.Logger');
goog.require('goog.events');


/**
 *
 */
class Handler {
  /**
   * @param {string=} name
   * @param {string=} prefix
   * @param {Object=} scope
   */
  constructor(name = 'Events', prefix = '', scope = undefined) {
    /** @type {string} */
    this.name = name || '';

    /** @type {string} */
    this.prefix = prefix || '';

    /** @type {Object|undefined} */
    this.scope = scope;

    /** @private {!cwc.utils.Logger} */
    this.log_ = new Logger(this.name);

    /** @private {!Array} */
    this.listener_ = [];

    /** @private {!Object} */
    this.timer_ = {};
  }


  /**
   * Adds an event listener for a specific event on a native event
   * target (such as a DOM element) or an object that has implemented
   * {@link goog.events.Listenable}.
   *
   * @param {EventTarget|goog.events.Listenable|string} src
   * @param {string} type Event type or array of event types.
   * @param {function(?)} listener Callback method
   * @param {boolean=} capture
   * @param {Object=} scope Object in whose scope to call the listener.
   * @return {number|goog.events.ListenableKey|null} Unique key
   */
  listen(src, type, listener, capture = false, scope = undefined) {
    let eventTarget = null;
    if (typeof src === 'string' || src instanceof String) {
      eventTarget = document.getElementById(this.prefix + src);
      if (!eventTarget) {
        this.log_.error('Unable to find listener element', this.prefix + src);
        return null;
      }
    } else {
      eventTarget = src;
    }
    if (!eventTarget) {
      this.log_.error('Undefined listener event target!', eventTarget);
      return null;
    }
    let listenerKey = goog.events.listen(eventTarget, type, listener, capture,
        scope || this.scope);
    this.listener_.push(listenerKey);
    return listenerKey;
  }


  /**
   * @param {number|goog.events.ListenableKey|null} key
   */
  unlisten(key) {
    if (typeof key === 'undefined') {
      this.log_.error('Unknown listener key.');
    }
    let result = goog.events.unlistenByKey(key);
    if (!result) {
      this.log_.error('Was unable to remove event', key);
    }
  }


  /**
   * Adds an event timer with the specific interval.
   *
   * @param {function(?)} func
   * @param {number} interval
   * @param {string=} name
   * @return {string}
   */
  addTimer(func, interval, name = Math.random().toString(36).substr(2, 9)) {
    this.timer_[name] = setInterval(func, interval);
    return name;
  }


  /**
   * @param {string} name
   */
  stopTimer(name) {
    if (typeof this.timer_[name] === 'undefined') {
      this.log_.error('Unknown timer', name);
    } else {
      clearInterval(this.timer_[name]);
    }
  }


  /**
   * Removes all defined event listeners over which are added over .listen.
   */
  clear() {
    this.log_.debug('Clearing', this.listener_.length, 'events listener');

    // Clear Event Listener
    for (let event of this.listener_) {
      this.unlisten(event.key);
    }
    this.listener_ = [];

    // Clear Timer
    for (let timer in this.timer_) {
      if (this.timer_.hasOwnProperty(timer)) {
        this.stopTimer(timer);
      }
    }
    this.timer_ = {};
  }
}


exports = Handler;
