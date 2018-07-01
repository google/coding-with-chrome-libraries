/**
 * @fileoverview Deps file.
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
/* eslint-disable max-len */
goog.addDependency('../../../../src/protocol/low-level/bluetooth-chrome/adapter.js', ['cwc.lib.protocol.bluetoothChrome.Adapter'], ['cwc.lib.protocol.bluetoothChrome.Events', 'cwc.lib.utils.log.Logger'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-chrome/api.js', ['cwc.lib.protocol.bluetoothChrome.Api'], ['cwc.lib.protocol.bluetoothChrome.Adapter', 'cwc.lib.protocol.bluetoothChrome.Devices', 'cwc.lib.protocol.bluetoothChrome.Events', 'cwc.lib.utils.log.Logger', 'goog.events.EventTarget'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-chrome/device.js', ['cwc.lib.protocol.bluetoothChrome.Device'], ['cwc.lib.protocol.Device', 'cwc.lib.protocol.bluetoothChrome.Events'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-chrome/devices.js', ['cwc.lib.protocol.bluetoothChrome.Devices'], ['cwc.lib.protocol.bluetoothChrome.Device', 'cwc.lib.protocol.bluetoothChrome.Profile', 'cwc.lib.utils.log.Logger', 'goog.async.Throttle'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-chrome/events.js', ['cwc.lib.protocol.bluetoothChrome.Events'], ['cwc.lib.utils.event.Data'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-chrome/profile.js', ['cwc.lib.protocol.bluetoothChrome.Profile'], [], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-web/api.js', ['cwc.lib.protocol.bluetoothWeb.Api'], ['cwc.lib.protocol.bluetoothWeb.Devices', 'cwc.lib.utils.log.Logger'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-web/device.js', ['cwc.lib.protocol.bluetoothWeb.Device'], ['cwc.lib.protocol.Device', 'cwc.lib.utils.Stack'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-web/devices.js', ['cwc.lib.protocol.bluetoothWeb.Devices'], ['cwc.lib.protocol.bluetoothWeb.Device', 'cwc.lib.protocol.bluetoothWeb.Profile', 'cwc.lib.utils.log.Logger'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-web/profile.js', ['cwc.lib.protocol.bluetoothWeb.Profile'], [], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-web/profile/device/device.js', ['cwc.lib.protocol.bluetoothWeb.profile.Device'], [], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/device.js', ['cwc.lib.protocol.Device'], ['cwc.lib.utils.log.Logger', 'goog.events.EventTarget'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/robots/api.js', ['cwc.lib.protocol.Api'], ['cwc.lib.utils.event.Handler', 'cwc.lib.utils.log.Logger', 'cwc.lib.utils.stream.Reader', 'goog.events.EventTarget'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/robots/lego/wedo2/api.js', ['cwc.lib.protocol.lego.weDo2.Api'], ['cwc.lib.protocol.Api', 'cwc.lib.protocol.bluetoothWeb.Profile', 'cwc.lib.protocol.lego.weDo2.Events', 'cwc.lib.protocol.lego.weDo2.Handler', 'cwc.lib.utils.byte.Tools'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/robots/lego/wedo2/buffer.js', ['cwc.lib.protocol.lego.weDo2.Buffer'], ['cwc.lib.utils.byte.array.BufferLSB'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/robots/lego/wedo2/commands.js', ['cwc.lib.protocol.lego.weDo2.Commands'], ['cwc.lib.protocol.lego.weDo2.Buffer', 'cwc.lib.protocol.lego.weDo2.Constants'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/robots/lego/wedo2/constants.js', ['cwc.lib.protocol.lego.weDo2.Constants'], [], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/robots/lego/wedo2/events.js', ['cwc.lib.protocol.lego.weDo2.Events'], ['cwc.lib.utils.event.Data'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/robots/lego/wedo2/handler.js', ['cwc.lib.protocol.lego.weDo2.Handler'], ['cwc.lib.protocol.lego.weDo2.Commands', 'cwc.lib.protocol.lego.weDo2.Constants'], {'module': 'goog'});
goog.addDependency('../../../../src/utils/byte/array/buffer/buffer.js', ['cwc.lib.utils.byte.array.Buffer'], ['cwc.lib.utils.byte.array.DataType'], {'module': 'goog'});
goog.addDependency('../../../../src/utils/byte/array/buffer/buffer_lsb.js', ['cwc.lib.utils.byte.array.BufferLSB'], ['cwc.lib.utils.byte.array.Buffer', 'cwc.lib.utils.byte.array.DataType'], {'module': 'goog'});
goog.addDependency('../../../../src/utils/byte/array/buffer/buffer_msb.js', ['cwc.lib.utils.byte.array.BufferMSB'], ['cwc.lib.utils.byte.array.Buffer', 'cwc.lib.utils.byte.array.DataType'], {'module': 'goog'});
goog.addDependency('../../../../src/utils/byte/array/data_type.js', ['cwc.lib.utils.byte.array.DataType'], [], {'module': 'goog'});
goog.addDependency('../../../../src/utils/byte/tools/tools.js', ['cwc.lib.utils.byte.Tools'], [], {'module': 'goog'});
goog.addDependency('../../../../src/utils/event/data.js', ['cwc.lib.utils.event.Data'], [], {'module': 'goog'});
goog.addDependency('../../../../src/utils/event/handler.js', ['cwc.lib.utils.event.Handler'], ['cwc.lib.utils.log.Logger', 'goog.events'], {'module': 'goog'});
goog.addDependency('../../../../src/utils/log/level.js', ['cwc.lib.utils.log.Level'], [], {'module': 'goog'});
goog.addDependency('../../../../src/utils/log/logger.js', ['cwc.lib.utils.log.Logger'], ['cwc.lib.utils.log.Level'], {'module': 'goog'});
goog.addDependency('../../../../src/utils/stack/stack.js', ['cwc.lib.utils.Stack'], [], {'module': 'goog'});
goog.addDependency('../../../../src/utils/stream/reader.js', ['cwc.lib.utils.stream.Reader'], ['cwc.lib.utils.byte.Tools'], {'module': 'goog'});
