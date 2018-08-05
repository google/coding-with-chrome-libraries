/**
 * @fileoverview Basic custom Logger.
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
goog.module('cwc.lib.utils.log.Logger');

const LogLevel = goog.require('cwc.lib.utils.log.Level');


/**
 * @class
 */
class Logger {
  /**
   * @param {string=} name
   * @param {number=} logLevel
   */
  constructor(name = 'Logger', logLevel = LogLevel.NOTICE) {
    /** @type {string} */
    this.name = name;

    /** @type {string} */
    this.displayName = this.name ? '%c' + this.name : '';

    /** @type {number} */
    this.logLevel = typeof cwc !== 'undefined' &&
      typeof cwc.config !== 'undefined' ?
      Number(cwc.config.Logging.LEVEL) : logLevel;

    /** @type {boolean} */
    this.enabled_ = typeof ENABLE_LOGGING === 'undefined' ?
      true : ENABLE_LOGGING;

    /** @type {!Function} */
    this.trace = function() {};

    /** @type {!Function} */
    this.debug = function() {};

    /** @type {!Function} */
    this.info = function() {};

    /** @type {!Function} */
    this.table = function() {};

    /** @type {!Function} */
    this.notice = function() {};

    /** @type {!Function} */
    this.warn = function() {};

    /** @type {!Function} */
    this.error = function() {};

    /** @type {!Function} */
    this.critical = function() {};

    /** @type {!Function} */
    this.alert = function() {};

    // Disable logging styles for specific environments like Mocha, Jasmine, ...
    if ((window['mocha'] || window['jasmine'] || window['__karma__']) &&
        this.name) {
      this.displayName = '[' + this.name + ']';
    }

    this.setLogLevel(this.logLevel);
  }


  /**
   * @param {!cwc.lib.utils.LogLevel} logLevel
   */
  setLogLevel(logLevel) {
    this.logLevel = logLevel;

    // Trace logger
    this.setLogger_('trace', LogLevel.TRACE, console.trace);

    // Debug logger
    this.setLogger_('debug', LogLevel.DEBUG, console.log);

    // Info logger
    this.setLogger_('info', LogLevel.INFO, console.log);

    // Table logger
    if (typeof console.table === 'undefined') {
      this.setLogger_('table', LogLevel.INFO, console.info);
    } else {
      this.setLogger_('table', LogLevel.INFO, console.table, true);
    }

    // Notice logger
    this.setLogger_('notice', LogLevel.NOTICE, console.log);

    // Warn logger
    this.setLogger_('warn', LogLevel.WARN, console.warn);

    // Error logger
    this.setLogger_('error', LogLevel.ERROR, console.error);

    // Critical logger
    this.setLogger_('critical', LogLevel.CRITICAL, console.error);

    // Critical logger
    this.setLogger_('alert', LogLevel.ALERT, console.error);
  }


  /**
   * @param {string} name
   * @param {!cwc.lib.utils.LogLevel} logLevel
   * @param {!Function} logger
   * @param {boolean=} raw
   * @private
   */
  setLogger_(name, logLevel, logger, raw) {
    // Enable logger for all errors and higher by default.
    if ((this.enabled_ || logLevel <= 3) && this.logLevel >= logLevel) {
      this[name] = this.log_(logger, raw);
    } else {
      this[name] = function() {};
    }
  }


  /**
   * @param {!Function} logger
   * @param {boolean=} raw
   * @return {Function}
   * @private
   */
  log_(logger, raw = false) {
    if (raw) {
      return Function.prototype.bind.call(logger, console);
    } else if (this.displayName.includes('%c')) {
      return Function.prototype.bind.call(logger, console, this.displayName,
        'font-weight: bold;');
    } else {
      return Function.prototype.bind.call(logger, console, this.displayName);
    }
  }
}


exports = Logger;
