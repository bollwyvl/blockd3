## Motivation
Expose the visualization-building power of [d3][] to curious users with a visual
programming metaphor provided by [blockly][].

## Demo
Check it out at http://bollwyvl.github.com/blockd3
It's a modification of the Blockly [code demo][codedemo], which has cool stuff
like Python generation.

## Documentation
Right now, most of the documentation is in the code. As we get closer to a 
useful project, I'd like to have canned lessons for some of the excellent 
community-built [tutorials][].

## Blocks Implemented
__need to automate updating this__

## Language Goals
Blockly aims to present a high-level interface to the d3 library in blocks, 
allowing the 99% of end users to concentrate on what a program does so they can 
learn how.

## MVP
To serve as a proof of concept, blockd3 should support the most common d3
paradigm:

 - a single SVG that fills the whole available area
 - data formatted in a JSON-based list of uniformly-constructed items
 - export to JavaScript for further tinkering.

## Contribute
Fork the repo, write code/test/docs, then make pull requests! Once you have the
repo locally, you will need to run a webserver to be able to load the blockd3
files... all other assets will be pulled down from CDN or the blockly site:

    python -m SimpleHTTPServer 8000

Then just go to http://localhost:8000.

Make suggestions via the [tickets][]!

Once the blockd3 API has stabilized, [bl.ocks][] (or something like it) should 
be fun for sharing examples! [github-api][] makes this look pretty easy.

## Roadmap
- block coverage of the d3 API
    - As soon as possible, blockd3 should be extracted automatically from the
      source of the d3 API wiki, or at the very least be checked for coverage.
- immediate visual update
- support [d3-plugins][]
- gist integration

## License
Blockd3 is licensed under the [Apache Public License][apl].


[d3]: https://github.com/mbostock/d3
[blockly]: http://code.google.com/p/blockly
[codedemo]: http://blockly-demo.appspot.com/blockly/demos/code
[d3-plugins]: https://github.com/d3/d3-plugins
[tickets]: https://github.com/bollwyvl/blockd3/issues
[bl.ocks]: http://bl.ocks.org/
[apl]: http://www.apache.org/licenses/LICENSE-2.0.html
[github-api]: https://github.com/fitzgen/github-api
[tutorials]: http://alignedleft.com/tutorials/d3/
