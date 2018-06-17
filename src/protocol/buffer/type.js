/**
 * @fileoverview Buffer types.
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
goog.module('cwc.lib.protocol.BufferType');
goog.module.declareLegacyNamespace();

/**
 * @enum {!number}
 */
exports = {
  BYTE: 1,
  SHORT: 2,
  INT: 3,
  UINT: 4,
  UINT16: 5,
  STR: 6,
  INDEX: 7,
};
