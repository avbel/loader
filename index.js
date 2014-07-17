"use strict";
let fs = require("fs");
let path = require("path");
module.exports.register = function*(plugin){
  let readdir = function(dir){
    return function(cb){
      fs.readdir(dir, function(err, files){
        if(err){
          if(err.errno == -2){
            plugin.log(["loader"], "Directory " + dir + " doesn't contains any files");
            cb(null, []);
          }
          else{
            cb(err);
          }
        }
        else{
          cb(null, files||[]);
        }
      });
    };
  };

  plugin.method("loader.loadModules", function*(directory){
    plugin.log(["loader"], "Loading modules from " + directory);
    let files = yield readdir(directory);
    return files.map(function(file){
      return {name: path.basename(file, path.extname(file)), exports: require(path.join(directory, file))};
    });
  });
};

module.exports.register.attributes = {
  name: "loader"
};