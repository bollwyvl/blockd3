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

// Extensions to Blockly's language and JavaScript generator for d3.

// Define Language and JavaScript, in case this file is loaded too early.
if (!Blockly.Language) {
  Blockly.Language = {};
}

(function(){

Selection = "SELECTION";
AnonFunction = "ANON_FUNCTION";

BLOCKD3_COLOR = 200;

Blockly.Language.d3_select = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: '',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('select');
    this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.setOutput(true, Selection);
    this.setTooltip('The first element that matches the selector');
  }
};

Blockly.Language.d3_select_all = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: '',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('select all');
    this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.setOutput(true, Selection);
    this.setTooltip('All elements that match the selection');
  }
};

Blockly.Language.d3_selection_select_all = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: '',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('select all');
    this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.appendInput('from', Blockly.INPUT_VALUE, 'PARENT', Selection);
    this.setOutput(true, Selection);
    this.setTooltip('All elements that match the selection');
  }
};

Blockly.Language.d3_style = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: '',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('set d3.style');
    this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.appendInput('of', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.appendInput('to', Blockly.INPUT_VALUE, 'VALUE');
    this.setTooltip('Set the CSS style');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Language.d3_attr = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: '',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('set d3.attribute');
    this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.appendInput('of', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.appendInput('to', Blockly.INPUT_VALUE, 'VALUE');
    this.setTooltip('Set the SVG attribute');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Language.d3_lambda = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: '',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.setOutput(true, AnonFunction);
    this.appendTitle('with function');
    this.appendInput('do', Blockly.NEXT_STATEMENT, 'DO');
    this.appendInput('return', Blockly.INPUT_VALUE, 'RETURN');
    this.setTooltip('A locally-defined function');
  }
};

})();
