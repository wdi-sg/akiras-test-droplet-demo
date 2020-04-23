var sha256 = require('js-sha256');

var hashedThing = sha256('The quick brown fox jumps over the lazy dog');

console.log("hashed");
console.log(hashedThing);

var hashedThing2 = sha256('the quick brown fox jumps over the lazy dog');
console.log(" **** hashed");
console.log(hashedThing2);