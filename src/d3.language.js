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

var BL = Blockly.Language;

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

/*
BL.d3_d3_select = {
  // d3.select - select an element from the current document.
  category: 'd3 Selection',
  helpUrl: doc.selections + 'd3_select',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('select');
    this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.setOutput(true, Selection);
    this.setTooltip('The first element that matches the selector');
  }
};


BL.d3_d3_selectAll = {
  // d3.selectAll - select multiple elements from the current document.
  category: 'd3 Selection',
  helpUrl: doc.selections + 'd3_selectAll',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('select all');
    this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.setOutput(true, Selection);
    this.setTooltip('All elements that match the selection');
  }
};


BL.d3_selectAll = {
  // d3 Selection value.
  category: 'd3 Selection',
  helpUrl: doc.selections + 'selectAll',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('select all');
    this.appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.appendInput('from', Blockly.INPUT_VALUE, 'PARENT', Selection);
    this.setOutput(true, Selection);
    this.setTooltip('All elements that match the selection');
  }
};



BL.d3_enter = {
  // selection.enter - returns placeholders for missing elements.
  category: 'd3 Selection',
  helpUrl: doc.selections + 'enter',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('enter');
    this.appendInput('from', Blockly.INPUT_VALUE, 'PARENT', Selection);
    this.setOutput(true, Selection);
    this.setTooltip('returns placeholders for missing elements');
  }
};


BL.d3_style = {
  // selection.style - get or set style properties.
  category: 'd3 Selection Transformation',
  helpUrl: doc.selections + 'style',
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

BL.d3_attr = {
  // selection.attr - get or set attribute values.
  category: 'd3 Selection Transformation',
  helpUrl: doc.selections + 'attr',
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


BL.d3_data = {
  // selection.data - get or set data for a group of elements, while computing a relational join.
  category: 'd3 Selection Manipulation',
  helpUrl: doc.selections + 'data',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('set data');
    this.appendInput('of', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.appendInput('to', Blockly.INPUT_VALUE, 'VALUE');
    
    this.setOutput(true, Selection);
    this.setTooltip('Set the data for a selection');
  }
};
BL.d3_classed = {
  // selection.classed - add or remove CSS classes.
  category: 'd3 Selection Transformation',
  helpUrl: doc.selections + 'classed',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('set class');
    this.appendInput('named', Blockly.INPUT_VALUE, 'CLS');
    this.appendInput('of', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.appendInput('to', Blockly.INPUT_VALUE, 'VALUE');
    this.setTooltip('Set the class of a selection');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};
*/








BL.d3_property = {
  // selection.property - get or set raw properties.
  category: 'd3 Selection Transformation',
  helpUrl: doc.selections + 'property',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('set property');
    this.appendInput('named', Blockly.INPUT_VALUE, 'PROP');
    this.appendInput('of', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.appendInput('to', Blockly.INPUT_VALUE, 'VALUE');
    this.setTooltip('Set the raw property of a selection');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


BL.d3_text = {
  // selection.text - get or set text content.
  category: 'd3 Selection Transformation',
  helpUrl: doc.selections + 'text',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('set text');
    this.appendInput('of', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.appendInput('to', Blockly.INPUT_VALUE, 'VALUE');
    this.setTooltip('Set the text of a selection');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


BL.d3_html = {
  // selection.html - get or set inner HTML content.
  category: 'd3 Selection Transformation',
  helpUrl: doc.selections + 'html',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('set HTML');
    this.appendInput('of', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.appendInput('to', Blockly.INPUT_VALUE, 'VALUE');
    this.setTooltip('Set the innerHTML of a selection');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

BL.d3_append = {
  // selection.append - create and append new elements.
  category: 'd3 Selection Manipulation',
  helpUrl: doc.selections + 'append',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('append');
    this.appendInput('to', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.appendInput('element', Blockly.INPUT_VALUE, 'VALUE');
    this.setTooltip('Append an element to a selection');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


BL.d3_insert = {
  // selection.insert - create and insert new elements before existing elements.
  category: 'd3 Selection Manipulation',
  helpUrl: doc.selections + 'insert',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('insert');
    this.appendInput('after', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.appendInput('element', Blockly.INPUT_VALUE, 'VALUE');
    this.setTooltip('Insert an element after a selection');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

BL.d3_remove = {
  // selection.remove - remove elements from the document.
  category: 'd3 Selection Manipulation',
  helpUrl: doc.selections + 'remove',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.appendTitle('remove');
    this.appendInput('selection', Blockly.INPUT_VALUE, 'ITEM', Selection);
    this.setTooltip('Remove a selection');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};



// selection.exit - returns elements that are no longer needed.
// selection.datum - get or set data for individual elements, without computing a join.
// selection.filter - filter a selection based on data.
// selection.sort - sort elements in the document based on data.
// selection.order - reorders elements in the document to match the selection.
// selection.on - add or remove event listeners for interaction.
// selection.transition - start a transition on the selected elements.
// selection.each - call a function for each selected element.
// selection.call - call a function passing in the current selection.
// selection.empty - returns true if the selection is empty.
// selection.node - access the first node in a selection.
// selection.select - subselect a descendant element for each selected element.
// selection.selectAll - subselect multiple descendants for each selected element.
// d3.selection - augment the selection prototype, or test instance types.
// d3.event - access the current user event for interaction.
// d3.mouse - gets the mouse position relative to a specified container.
// d3.touches - gets the touch positions relative to a specified container.



BL.d3_lambda = {
  // d3 Selection value.
  category: 'd3 Utility',
  helpUrl: '',
  init: function() {
    this.setColour(BLOCKD3_COLOR);
    this.setOutput(true, AnonFunction);
    this.appendTitle('with function');
    this.appendInput('datum', Blockly.LOCAL_VARIABLE, 'DATUM').setText('datum');
    this.appendInput('index', Blockly.LOCAL_VARIABLE, 'INDEX').setText('index');
    this.appendInput('do', Blockly.NEXT_STATEMENT, 'DO');
    this.appendInput('return', Blockly.INPUT_VALUE, 'RETURN');
    this.setTooltip('A locally-defined function');
  },
  getVars: function() {
    return [this.getInputVariable('DATUM'), this.getInputVariable('INDEX')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getInputVariable('DATUM'))) {
      this.setInputVariable('DATUM', newName);
    }
    if (Blockly.Names.equals(oldName, this.getInputVariable('INDEX'))) {
      this.setInputVariable('INDEX', newName);
    }
  }
};

// developer

BL.dev_debugger = {
  // debugger: starts the debugger
  category: '1337',
  helpUrl: doc.selections + 'remove',
  init: function() {
    this.setColour(0);
    this.appendTitle('debugger');
    this.setTooltip('launches the debugger');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


BL.dev_console_log = {
  // console.log: draws to the console
  category: '1337',
  helpUrl: doc.selections + 'remove',
  init: function() {
    this.setColour(0);
    this.appendTitle('console');
    this.appendInput('log', Blockly.INPUT_VALUE, 'LOG');
    this.setTooltip('logs the value');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


})();
