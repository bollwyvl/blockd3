"use strict";

var assert = require("assert"),
    path = require("path"),
    fs = require("fs"),
    glob = require("glob"),
    vows = require("vows"),
    prenup = require("prenup"),
    events = require("events"),
    // suite
    suite = vows.describe("blockd3 wiki coverage"),
    // workflow
    wikiWorfklow;
    
wikiWorfklow = prenup.createContext(function () {
    return 1;
})

wikiWorfklow.vow("api method is in ", function (item) {
    
});

suite.addBatch({"wiki": wikiWorfklow.seal()});

suite.export(module);
