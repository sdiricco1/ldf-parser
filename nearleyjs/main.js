/**
 * --------------------------------------------------------
 * GLOBAL VARIABLES
 * --------------------------------------------------------
 */
const nearley = require("nearley");
const fs = require('fs');
const { exec } = require("child_process");

var nodes_ldf;
var grammar_nodes;

/**
 * --------------------------------------------------------
 * FUNCTIONS
 * --------------------------------------------------------
 */
let execPromise = (command) => {
  return new Promise((resolve, reject)  => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  })
}

let readFilePromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data);
      }
    })
  })
}

let writeFilePromise = (path) => {
  return new Promise((resolve,reject) => {
    fs.writeFile(path, myJson, err => err ? reject(err) : resolve(true));
  })
}



/**
 * --------------------------------------------------------
 * MAIN
 * --------------------------------------------------------
 */
let main = async () => {

  //Convert a .ne file to a .js file
  try {
    var output = await execPromise("nearleyc ./grammar/grammar_nodes.ne -o ./grammar/grammar_nodes.js");
    console.log(output);
  } catch (error) {
    console.log(error);
  }
  
  grammar_nodes = require("./grammar/grammar_nodes.js");
  // Create a Parser object from our grammar.
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar_nodes));

  //read LDF file
  try {
    nodes_ldf = await readFilePromise('./ldf/nodes.ldf');
  } catch (error) {
    console.log("erorri in lettura file");
  }

  // Parse LDF file
  parser.feed(nodes_ldf);
  console.log(JSON.stringify(parser.results[0]));

  writeFilePromise('.json/nodes.json')

}

main();








// // write JSON string to a file
// fs.writeFile('user.json', myJson, (err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("JSON data is saved.");
// });


// const fs = require('fs')

// fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   console.log(data)
// })