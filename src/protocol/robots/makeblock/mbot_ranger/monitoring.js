/**
 * @fileoverview Define monitors used in mBot Ranger protocol.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
goog.module('cwc.lib.protocol.makeblock.mBotRanger.Monitoring');

const Constants =
  goog.require('cwc.lib.protocol.makeblock.mBotRanger.Constants');
const EventHandler = goog.require('cwc.lib.utils.event.Handler');
const Logger = goog.require('cwc.lib.utils.log.Logger');


/**
 * @enum {!numbers}
 */
const MonitoringIntervals = {
  'LIGHTSENSOR_1': 1500,
  'LIGHTSENSOR_2': 1750,
  'LINEFOLLOWER': 275,
  'TEMPERATUR': 1500,
  'ULTRASONIC': 250,
};


/**
 * @class
 */
class Monitoring {
  /**
   * @param {!cwc.protocol.makeblock.mBotRanger.Api} api
   */
  constructor(api) {
    /** @type {!cwc.protocol.makeblock.mBotRanger.Api} */
    this.api = api;

    /** @type {string} */
    this.name = 'mBot Ranger Monitoring';

    /** @type {boolean} */
    this.started = false;

    /** @private {!cwc.utils.Events} */
    this.events_ = new EventHandler(this.name);

    /** @private {!Object} */
    this.monitor_ = {};

    /** @private {!cwc.utils.Logger|null} */
    this.log_ = new Logger(this.name);
  }


  /**
   * start sending reading sensor signals.
   * @export
   */
  start() {
    if (this.started) {
      return;
    }
    this.log_.info('Starting...');
    this.enableMonitor('LIGHTSENSOR_1',
      Constants.CallbackType.LIGHTSENSOR_1,
      Constants.Device.LIGHTSENSOR,
      Constants.Port.LIGHTSENSOR_1
    );
    this.enableMonitor('LIGHTSENSOR_2',
      Constants.CallbackType.LIGHTSENSOR_2,
      Constants.Device.LIGHTSENSOR,
      Constants.Port.LIGHTSENSOR_2
    );
    this.enableMonitor('LINEFOLLOWER',
      Constants.CallbackType.LINEFOLLOWER,
      Constants.Device.LINEFOLLOWER,
      Constants.Port.LINEFOLLOWER
    );
    this.enableMonitor('TEMPERATUR',
      Constants.CallbackType.TEMPERATURE,
      Constants.Device.TEMPERATURE,
      Constants.Port.TEMPERATURE
    );
    this.enableMonitor('ULTRASONIC',
      Constants.CallbackType.ULTRASONIC,
      Constants.Device.ULTRASONIC,
      Constants.Port.ULTRASONIC
    );
    this.started = true;
  }


  /**
   * stop sending reading sensor signals.
   * @export
   */
  stop() {
    if (!this.started) {
      return;
    }
    this.log_.info('Stopping...');
    Object.keys(this.monitor_).forEach(function(port) {
      clearInterval(this.monitor_[port]);
      this.monitor_[port] = undefined;
    }.bind(this));
    this.started = false;
  }


  /**
   * @param {string} name
   * @param {!cwc.protocol.makeblock.mBot.IndexType} index
   * @param {!cwc.protocol.makeblock.mBot.Device} device
   * @param {!cwc.protocol.makeblock.mBot.Port} port
   */
  enableMonitor(name, index, device, port) {
    if (!port || !name) {
      return;
    }
    if (typeof this.monitor_[name] !== 'undefined') {
      clearInterval(this.monitor_[name]);
      this.monitor_[name] = undefined;
    }
    let buffer = this.api.getBufferSigned('getSensorData', {
      'index': index, 'device': device, 'port': port,
    });
    let interval = MonitoringIntervals[name];
    this.log_.info('Enable monitoring for', name, 'with interval', interval);
    this.api.send_(buffer);
    this.monitor_[name] = setInterval(
      this.api.send_.bind(this.api), interval, buffer);
  }


  /**
   * Clean up monitoring.
   */
  cleanUp() {
    this.log_.info('Clean up ...');
    this.events_.clear();
    this.stop();
  }
}


exports = Monitoring;
