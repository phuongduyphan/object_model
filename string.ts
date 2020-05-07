import {
  Object,
  objectVt,
  rootVt,
  createVt,
  newObj,
  send
} from './obj_model';

// Usage: create a string type object

function stringSet (obj: Object, str: string) {
  obj.str = str;
  return obj;
}

function stringLength (obj: Object) {
  return obj.str.length;
}

console.log("objVt = ", objectVt);
console.log("rootVt = ", rootVt);
console.log(rootVt._vTable === rootVt);

const stringVt = createVt({ set: stringSet, length: stringLength }, objectVt);
console.log("stringVt = ", stringVt);
console.log("objVt = ", objectVt);
console.log("rootVt = ", rootVt);
let str = newObj(stringVt);
console.log("str = ", str);

str = send(str, "set", "Hello World!");
console.log("str = ", str);

const length = send(str, "length");
console.log("str.length =", length);