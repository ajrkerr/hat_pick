var fs           = require('fs');
var childProcess = require('child_process');
var blackList    = [/node_modules/, /\.git/];


function addListener (dir) {
  // Check if this pattern matches our blacklist
  for(var i = 0; i < blackList.length; i++) {
    if(blackList[i].test(dir)) { return; }
  }
  // blackList.forEach(function (regEx) {
  //   if(regEx.test(dir)) { return; }
  // });

  console.log("Watching %s", dir);
  // Recursively add listeners to all subfolders
  fs.readdir(dir, function (err, files) {

    // Check all files, filter for directories
    files.forEach(function(file) {
      fs.stat(dir + "/" + file, function (err, stats) {
        if(err) { console.log(err); }

        if(!err && stats.isDirectory()) {
          addListener(dir + "/" + file);
        }
      });
    });
  });

  fs.watch(dir, function (event, filename) {
    console.log("%s Detected", event);

    if(event == "change") {
      console.log("Restarting node...");
      var proc = childProcess.spawn("forever", ["restart", "0"]);

      // proc.stderr.on("data", console.log);
      // proc.stdout.on("data", console.log);
    }
  });
}

addListener(".");
