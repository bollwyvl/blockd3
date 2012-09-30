import re
import os

WIKI = "git clone https://github.com/mbostock/d3.wiki.git"
re_anchor = re.compile(r'<a[^>]name="([^"]*)"')

LANG = "d3.language.js"
re_block = re.compile(r'Blockly.Language.([^ ]*) = \{')

GNR8 = "d3.generator.js"
re_gnr8 = re.compile(r'Blockly.JavaScript.([^ ]*) = function')





