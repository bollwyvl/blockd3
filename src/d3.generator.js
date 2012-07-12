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

(function(){

BJS = Blockly.Generator.get('JavaScript');

function join_none(args){
    return [args.join(""), BJS.ORDER_ATOMIC];
}

BJS.d3_d3_select = function() {
    return join_none([
        'd3.select("',
        this.getTitleValue('TEXT'),
        '")'
    ]);
};

BJS.d3_d3_selectAll = function() {
    return join_none([
        'd3.selectAll("',
        this.getTitleValue('TEXT'),
        '")'
    ]);
};

BJS.d3_selectAll = function() {
    return join_none([
        BJS.valueToCode(this, 'PARENT', BJS.ORDER_NONE),
        '.selectAll("',
        this.getTitleValue('TEXT'),
        '")'
    ]);
};

BJS.d3_style = function() {
    return [
        BJS.valueToCode(this, 'ITEM', BJS.ORDER_NONE),
        '.style("',
        this.getTitleValue('TEXT'),
        '", ',
        BJS.valueToCode(this, 'VALUE', BJS.ORDER_NONE),
        ');\n'
      ].join("");
};

BJS.d3_attr = function() {
    return [
        BJS.valueToCode(this, 'ITEM', BJS.ORDER_NONE),
        '.attr("',
        this.getTitleValue('TEXT'),
        '", ',
        BJS.valueToCode(this, 'VALUE', BJS.ORDER_NONE),
        ');\n'
    ].join("");
};

BJS.d3_lambda = function() {
    return join_none([
        'function(',
        this.getInputVariable('DATUM'),
        ',',
        this.getInputVariable('INDEX'),
        '){\n',
        BJS.valueToCode(this, 'DO', BJS.ORDER_NONE),
        '\nreturn ',
        BJS.valueToCode(this, 'RETURN', BJS.ORDER_NONE),
        ';\n}'
    ]);
};

BJS.d3_data = function() {
    return [
        BJS.valueToCode(this, 'ITEM', BJS.ORDER_NONE),
        '.data(',
        BJS.valueToCode(this, 'VALUE', BJS.ORDER_NONE),
        ');\n'
    ].join("");
};
})();
