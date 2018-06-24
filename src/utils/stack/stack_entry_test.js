/**
 * @fileoverview Stack Entry tests.
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
goog.require('cwc.lib.utils.Stack');


goog.scope(function() {
const StackEntry = goog.module.get('cwc.lib.utils.Stack').Entry;
const StackType = goog.module.get('cwc.lib.utils.Stack').Type;

describe('StackEntry', function() {
  let type = StackType.CMD;
  let func = function(data) {
    return data['a'] + data['b'];
  };
  let value = {a: 11, b: 12};
  let callback = function(test) {
    return test;
  };
  let stackEntry = new StackEntry(type, func, value, callback);

  it('constructor', function() {
    expect(typeof stackEntry).toEqual('object');
  });

  it('getCallback', function() {
    expect(stackEntry.getCallback()).toEqual(callback);
  });

  it('getFunc', function() {
    expect(stackEntry.getFunc()).toEqual(func);
  });

  it('getType', function() {
    expect(stackEntry.getType()).toEqual(type);
  });

  it('getValue', function() {
    expect(stackEntry.getValue()).toEqual(value);
  });
});
});
