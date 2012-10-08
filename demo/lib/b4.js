/*
Copyright 2012 Nicholas Bollweg

https://github.com/bollwyvl/b4

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function (Blockly) {
// probably `document`
var root = this;

/*
convenience functions
*/
function undef(value){
    return _.isUndefined(value);
}

/*
global namespace
*/
var b4 = function(){ return b4; };

b4.VERSION = "0.1";

/*
create a new block, taking the above configuration into account

instead of incrementally building up all of the bits, wait until the
`done()` is called.
*/
b4.block = function(value){
    var my = {
            _parent: undefined,
            _id: undefined,
            _namespace: undefined,
            _language: undefined,
            _generator: undefined,
            _category: undefined,
            _help_url_template: undefined,
            _help_url: undefined,
            _tooltip: undefined,
            _output: undefined,
            _colour: undefined,
            _previous_statement: undefined,
            _next_statement: undefined,
            _inline: undefined,
            _title: undefined,
            _blocks: undefined,
            _code: undefined,
            _code_order: undefined
        },
        block = function(){};

    /*
    common task of inheriting value from parent
    */

    function _inherit(var_name, api_name, setter_callback){
        block[api_name] = function(value){
            if(undef(value)){
                if(undef(my[var_name])){
                    if(undef(my._parent)){
                        return undefined;
                    }else{
                        return my._parent[api_name]();
                    }
                }else{
                    return my[var_name];
                }
            }else{
                if(undef(setter_callback)){
                    my[var_name] = value;
                    return block;
                }else{
                    var ret = setter_callback(value);
                    return undef(ret) ? block : ret;
                }
            }
        };
    }

    /*
    make a new block from this block, using this block for defaults

    fills the role of mold
    */
    block.clone = function(value){
        var new_block = b4.block(value);
        return new_block.parent(block);
    };

    /*
    set this block's parent block
    */
    block.parent = function(value){
        if(undef(value)) return my._parent;
        my._parent = value;
        return block;
    };

    /*
    where the block will be installed in the global (arg!) namespace

    not inherited!
    */
    block.id = function(value){
        if(undef(value)){
            return [
                block.namespace() || "",
                my._id || ""
            ].join("");
        }

        my._id = value;
        return block;
    };

    /*
    the blockly generator

    Set the (computer) language generator. Probably one of:

    - JavaScript
    - Python
    - Dart
    */
    _inherit("_generator", "generator");

    /*
    the internationalized blockly block builder

    Set the (human) language generator. Probably one of:

    - en
    - zh
    - de

    TODO: how do you specify more than one of these bad boys? magic paths FAIL
    */
    _inherit("_language", "language");

    /*
    the namespace into which this block should be installed... you'll
    probably want to set this on the configuration...
    */
    _inherit("_namespace", "namespace");

    /*
    the display category
    */
    _inherit("_category", "category");

    /*
    the help url template, following [underscore.template][tmpl] convention

    [tmpl]: http://documentcloud.github.com/underscore/#template
    */
    _inherit("_help_url_template", "helpUrlTemplate");

    /*
    the help url. If not specified explicitly, will use the template
    from the configuration.
    */
    block.helpUrl = function(value){
        var tmpl;
        if(undef(value)){
            if(!undef(my._help_url)){
                return my._help_url;
            }else{
                tmpl = block.helpUrlTemplate();
                var output = _.template(tmpl || "",
                    block,
                    {"variable": "block"}
                ); 
                return output;
            }
        }
        my._help_url = value;
        return my._help_url;
    };

    /*
    set the mouseover tooltip
    */
    _inherit("_tooltip", "tooltip");

    /*
    set the output for a block.
    To not specify a type (but demand the output) pass

        true

    to specify a type, e.g.

        "Number"

    or a list of types

        ["Number", "String"]

    If no value provided, returns the list of allowed values.

    Also, see convenience methods.
    */
    _inherit("_output", "output");

    /*
    the color currently being used for new blocks
    */

    _inherit("_colour", "colour", function(value){
        if(_.isNumber(value)){
            // accept Hue as `Number`...
            my._colour = value;
        }else{
            // ...or any CSS value
            my._colour = Color(value).hue();
        }
    });

    /*
    whether the statement has a notch above for a previous statement.

    provide true just to get the block.

    provide a list of statement types to limit the blocks to which
    this one can be attached

    see the convenience function below to set both statements at once

    TODO: HOW IS THIS DEFINED?

    TODO: I think this accepts lists?
    */

    _inherit("_previous_statement", "previousStatement");

    /*
    whether the statement has a notch below for a next statement.

    provide a list of statement types to limit which blocks can
    connect after this one

    see the convenience function below to set both statements at once

    TODO: HOW IS THIS DEFINED?

    TODO: I think this accepts lists?
    */
    _inherit("_next_statement", "nextStatement");

    block.title = function(value){
        // getter
        if(undef(value)){
            // no parent
            if(undef(my._parent)){
                return undef(my._title) ? [] : my._title;
            //with parent
            }else{
                // this is probably not right
                var title_list = my._parent.title().slice();
                if(!undef(my._title)){
                    title_list = title_list.concat(my._title);
                }
                return title_list;
            }
        // setter
        }else{
            my._title = value;
            return block;
        }
    };

    /*
        Add something to the title row

        Otherwise, list the titles
    */
    block.appendTitle = function(value){
        if(undef(my._title)){
            my._title = [];
        }
        var new_title = value;
        // is this a "dumb" value?
        if(!_.isFunction(value)){
            new_title = function(blockly_scope){
                return value;
            };
            new_title.id = function(){ return undefined; };
        }
        my._title.push(new_title);
        return block;
    };
    
    /*
    the code that will be executed
    
    accepts the current flavor of [template][tmpl].
    */
    _inherit("_code", "code");
    
    /*
    the join rules (as of 2012.10.07)
    
    Blockly.Python.ORDER_ATOMIC = 0;            // 0 "" ...
    Blockly.Python.ORDER_COLLECTION = 1;        // tuples, lists, dictionaries
    Blockly.Python.ORDER_STRING_CONVERSION = 1; // `expression...`
    Blockly.Python.ORDER_MEMBER = 2;            // . []
    Blockly.Python.ORDER_FUNCTION_CALL = 2;     // ()
    Blockly.Python.ORDER_EXPONENTIATION = 3;    // **
    Blockly.Python.ORDER_UNARY_SIGN = 4;        // + -
    Blockly.Python.ORDER_BITWISE_NOT = 4;       // ~
    Blockly.Python.ORDER_MULTIPLICATIVE = 5;    // * / // %
    Blockly.Python.ORDER_ADDITIVE = 6;          // + -
    Blockly.Python.ORDER_BITWISE_SHIFT = 7;     // << >>
    Blockly.Python.ORDER_BITWISE_AND = 8;       // &
    Blockly.Python.ORDER_BITWISE_XOR = 9;       // ^
    Blockly.Python.ORDER_BITWISE_OR = 10;       // |
    Blockly.Python.ORDER_RELATIONAL = 11;       // in, not in, is, is not,
                                                //     <, <=, >, >=, <>, !=, ==
    Blockly.Python.ORDER_LOGICAL_NOT = 12;      // not
    Blockly.Python.ORDER_LOGICAL_AND = 13;      // and
    Blockly.Python.ORDER_LOGICAL_OR = 14;       // or
    Blockly.Python.ORDER_CONDITIONAL = 15;      // if else
    Blockly.Python.ORDER_LAMBDA = 16;           // lambda
    Blockly.Python.ORDER_NONE = 99;             // (...)
    */
    _inherit("_code_order", "codeOrder");
    
    block.generateCode = function(blockly_scope, generator){
        return [
            _.template(
                block.code(),
                blockly_scope,
                {"variable": "block"}),
            block.codeOrder() || generator.ORDER_ATOMIC
        ]; 
    };

    /*
    whether inputs should be displayed inline
    */
    _inherit("_inline", "inputsInline");

    /*
    write the block to the generator and language!

    NOTE TO SELF:
    be careful to capture all of the scoped bits at time
    of installation, don't evaluate after the fact: this should
    prevent creep of values into way late in the game.
    */
    block.done = function(){
        /*
            set up language definition out in this scope, so that they
            don't get reevaluated later. that would be sad.
        */
        var BL = Blockly.Language,
            blid = block.id(),
            cfg = {
                setColour: block.colour(),
                setTooltip: block.tooltip(),
                setOutput: block.output(),
                setPreviousStatement: block.previousStatement(),
                setNextStatement: block.nextStatement(),
                inputsInline: block.inputsInline()
            },
            title_list = block.title();
        
        console.log("ADDING", blid, "to Language ", BL);
        
        BL[blid] = {
            category: block.category(),
            helpUrl: block.helpUrl(),
            init: function(){
                var that = this;
                _.map(cfg, function(val, func){
                    if(undef(val)){ return; }
                    
                    var maybe_bool = _.contains([
                            "setOutput",
                            "setPreviousStatement",
                            "setNextStatement"
                        ], func);
                    
                    if(maybe_bool && (val !== true && val !== false)){
                        that[func](true, val);
                    }else{
                        that[func](val);
                    }
                });
                
                // set up title
                _.map(title_list, function(title_callback){
                    var title_item = title_callback();
                    that.appendTitle(title_item, title_callback.id());
                });
            }
        };
        
        console.log("ADDING", blid, "to Generator", BG);
        // this is the trickiest bit, to avoid scope leakage
        var BG = Blockly.Generator.get(block.generator());
        
        BG[blid] = function(){
            return block.generateCode(this, BG);
        };

        return block;
    };

    // this is the end
    return block.id(value || "");
};

/*
Input superclass
*/
b4.field = function(){};

b4.field.text = function(value){
    var field = function(blockly_scope){
            return new Blockly.FieldTextInput(field.init());
        },
        my = {
            _init: undefined,
            _id: undefined
        };
    /*
    field id in this scope (block)
    */
    field.id = function(value){
        if(undef(value)) return my._id;
        my._id = value;
        return field;
    };
    
    /*
    the initial value for a field
    */
    field.init = function(value){
        if(undef(value)) return my._init;
        my._init = value;
        return field;
    };
    
    return field.id(value || "");
};

// install it!
root.b4 = b4;
})(Blockly);