"use strict";
let Hapi = require("co-hapi");
describe("loader", function(){
  let server;
  before(function*(){
    server = Hapi.createServer("localhost", 3001);
    yield server.pack.register(require(".."));
  });
  describe("loader.loadModules", function(){
    it("should be part of server.methods", function*(){
      (typeof server.methods.loader.loadModules === "function").should.be.true;
    });

    it("should load all modules from given directory", function*(){
      let result = yield server.methods.loader.loadModules(__dirname + "/plugins");
      result.length.should.equal(2);
      result.map(function(m){ return m.name;}).sort().should.eql(["plugin1", "plugin2"]);
      result[0].exports.should.be.ok;
      result[1].exports.should.be.ok;
    });
  });
});
