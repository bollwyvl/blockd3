"use strict";

//imports
var assert = require("assert"),
    path = require("path"),
    fs = require("fs"),
    glob = require("glob"),
    vows = require("vows"),
    prenup = require("prenup"),
    events = require("events"),
    gitteh = require("gitteh"),
    temp = require("temp"),
    // suite
    suite = vows.describe("blockd3 wiki coverage"),
    // workflow
    wiki_worfklow,
    // git stuff
    repo_path = temp.mkdirSync(),
    wiki_repo = "https://github.com/mbostock/d3.wiki.git";


gitteh.clone(wiki_repo, repo_path)
    .on("complete", function(repo) {
        console.log("\n... Complete!");
        console.log(wiki_repo);
    });
  
wiki_worfklow = prenup.createContext(function () {
    return 1;
})


wiki_worfklow.vow("api method is in ", function (item) {
    
});

suite.addBatch({"wiki": wikiWorfklow.seal()});

suite.export(module);


