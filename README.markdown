# Motivation
Expose the visualization-building power of [d3][] to curious users with a visual
programming metaphor provided by [blockly][] with immediate visual feedback.

# Language
blocky aims to present a high-level interface, allowing end users to concentrate
on what a program does, rather than how.

For this to work with d3, the implemented blocks must make it very easy to see
what a particular d3 call is doing.

# Limitations
To serve as a proof of concept, blockd3 will concentrate on one of the most
common d3 paradigms:

 - a single [svg][] that fills the whole available area
 - data formatted in a JSON-based list of uniformly-constructed items
 - export to JavaScript
 
# Methodology
As soon as possible, blockd3 should be extracted automatically from the
source of the d3 API wiki.

# Roadmap
- immediate update
- Support [d3 plugins][].

# Blocks

[d3]: https://github.com/mbostock/d3
[blockly]: http://code.google.com/p/blockly
