/**
 * blockd3: d3 in blockly
 *
 * Copyright 2012 Google Inc.
 * https://github.com/bollwyvl/blockd3
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
 */

/**
 * @fileoverview Demonstration of blockd3
 * @author nick.bollweg@gmail.com (Nick Bollweg)
 */

//  Extensions to Blockly's language and JavaScript generator for d3.

// Define Language and JavaScript, in case this file is loaded too early.
if (!Blockly.Language) {
  Blockly.Language = {};
}

Blockly.JavaScript = Blockly.Generator.get('JavaScript');

Blockly.JavaScript.d3_d3_select = function() {
  var code = 'd3.select("' + this.getTitleValue('TEXT') + '")';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.d3_d3_selectAll = function() {
  var code = 'd3.selectAll("' + this.getTitleValue('TEXT') + '")';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.d3_selectAll = function() {
  var code = [
    Blockly.JavaScript.valueToCode(this, 'PARENT') || 'null',
    '.selectAll("',
    this.getTitleValue('TEXT'),
    '")'
  ].join('');
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.d3_style = function() {
  // circle.style("fill", "steelblue");
  return [
    Blockly.JavaScript.valueToCode(this, 'ITEM') || 'null',
    '.style("',
    this.getTitleValue('TEXT'),
    '", ',
    Blockly.JavaScript.valueToCode(this, 'VALUE') || 'null',
    ');\n'
  ].join('');
};

Blockly.JavaScript.d3_attr = function() {
  // circle.attr("r", 9);
  return [
    Blockly.JavaScript.valueToCode(this, 'ITEM') || 'null',
    '.attr("',
    this.getTitleValue('TEXT'),
    '", ',
    Blockly.JavaScript.valueToCode(this, 'VALUE') || 'null',
    ');\n'
  ].join('');
};

Blockly.JavaScript.d3_lambda = function() {
  /* circle.attr("cx", function(datum, index) {
      return Math.random() * w;
    });
  */
  var code = [
    'function(',
    this.getTitleValue('DATUM'),
    ',',
    this.getTitleValue('INDEX'),
    '){\n  ',
    Blockly.JavaScript.valueToCode(this, 'DO'),
    '\n  return ',
    Blockly.JavaScript.valueToCode(this, 'RETURN') || 'null',
    ';\n}'
  ].join('');
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.d3_data = function() {
  // circle.data([1,2,3]);
  return [
    Blockly.JavaScript.valueToCode(this, 'ITEM') || 'null',
    '.data(',
    Blockly.JavaScript.valueToCode(this, 'VALUE') || 'null',
    ');\n'
  ].join('');
};
