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

/*  Style
    TODO: break these up for different patterns
*/
var BLOCKD3_COLOR = 200;

/*  Types
*/
var Selection = "SELECTION",
    AnonFunction = "ANON_FUNCTION";


/* Documentation
*/
var wiki = "https://github.com/mbostock/d3/wiki/",
    doc = {
        selections: wiki + "Selections#wiki-",
    };


Blockly.Language.d3_d3_select = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: doc.selections + 'd3_select',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendDummyInput()
        .appendTitle('select')
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.setOutput(true, Selection);
    this.setTooltip('The first element that matches the selector');
  }
};

Blockly.Language.d3_d3_selectAll = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: doc.selections + 'd3_selectAll',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendDummyInput()
        .appendTitle('select all')
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.setOutput(true, Selection);
    this.setTooltip('All elements that match the selection');
  }
};

Blockly.Language.d3_selectAll = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: doc.selections + 'selectAll',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendValueInput('PARENT')
        .setCheck(Selection)
        .appendTitle('select all')
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
        .appendTitle('from');
    this.setOutput(true, Selection);
    this.setTooltip('All elements that match the selection');
  }
};

Blockly.Language.d3_style = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: doc.selections + 'style',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendValueInput('ITEM')
        .setCheck(Selection)
        .appendTitle('set d3.style')
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
        .appendTitle('of');
    this.appendValueInput('VALUE')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendTitle('to');
    this.setTooltip('Set the CSS style');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Language.d3_attr = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: doc.selections + 'attr',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendValueInput('ITEM')
        .setCheck(Selection)
        .appendTitle('set d3.attribute')
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
        .appendTitle('of');
    this.appendValueInput('VALUE')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendTitle('to');
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
    this.appendDummyInput()
        .appendTitle('function: with datum')
        .appendTitle(new Blockly.FieldVariable('datum'), 'DATUM');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendTitle('index')
        .appendTitle(new Blockly.FieldVariable('index'), 'INDEX');
    this.appendStatementInput('DO')
        .appendTitle('do');
    this.appendValueInput('RETURN')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendTitle('return');
    this.setTooltip('A locally-defined function');
  },
  getVars: function() {
    return [this.getTitleValue('DATUM'), this.getTitleValue('INDEX')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getTitleValue('DATUM'))) {
      this.setInputVariable('DATUM', newName);
    }
    if (Blockly.Names.equals(oldName, this.getTitleValue('INDEX'))) {
      this.setInputVariable('INDEX', newName);
    }
  }
};


Blockly.Language.d3_data = {
  // d3 Selection value.
  category: 'd3',
  helpUrl: doc.selections + 'data',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendValueInput('ITEM')
        .setCheck(Selection)
        .appendTitle('set data of');
    this.appendValueInput('VALUE')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendTitle('to');
    this.setTooltip('Set the data for a selection');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

})();
