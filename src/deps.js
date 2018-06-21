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
goog.addDependency('../../../../src/protocol/buffer/buffer.js', ['cwc.lib.protocol.Buffer'], ['cwc.lib.protocol.BufferType'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/buffer/buffer_test.js', ['cwc.lib.protocol.BufferTest'], ['cwc.lib.protocol.Buffer', 'cwc.lib.protocol.BufferType'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/buffer/type.js', ['cwc.lib.protocol.BufferType'], [], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-chrome/adapter.js', ['cwc.lib.protocol.bluetoothChrome.Adapter'], ['cwc.lib.protocol.bluetoothChrome.Events', 'cwc.lib.utils.Logger'], {'module': 'goog'});
goog.addDependency('../../../../src/protocol/low-level/bluetooth-chrome/events.js', ['cwc.lib.protocol.bluetoothChrome.Events'], ['cwc.utils.EventData'], {'module': 'goog'});
