interface Object {
  _parent?: Object | null;
  _vTable?: Object | null;
  [key: string]: any; // Object state
}

const addMethod = (vTable: Object, methodSymbol: string, methodImpl: Function): void => {
  vTable[methodSymbol] = methodImpl;
}

const delegate = (obj: Object): Object => {
  return {
    _parent: obj,
    _vTable: obj._vTable
  }
}

const allocate = (vTable: Object): Object => {
  return {
    _parent: null,
    _vTable: vTable,
    data: {}
  }
}

const lookUp = (obj: Object, methodSymbol: string) => {
  if (methodSymbol in obj)
    return obj[methodSymbol]
  else if (obj._parent)
    return send(obj._parent, S.LOOK_UP, methodSymbol);
  else
    throw new Error(`Method ${methodSymbol} cannot be found`);
}

function send (obj: Object, methodSymbol: string, ...args: any[]): any {
  let closure;
  if (methodSymbol == S.LOOK_UP && obj._vTable === obj) {
    closure = lookUp(obj._vTable, S.LOOK_UP)
  } else if (obj._vTable) {
    closure = send(obj._vTable, S.LOOK_UP, methodSymbol);
  } else {
    throw new Error('Missing Object vtable');
  }
  //const closure = lookUp(obj, methodSymbol);

  // Closure can be implemented in AML or directly in JS
  // This allows for mix-mode execution of code
  //
  // We can do something like this
  // if (isAML(closure)) {
  //  return interpretClosure(closure, obj, ...args);
  // } else if (isJSFunc(closure)) {
  //  return closure(obj, ...args);
  // }

  return closure(obj, ...args);
}

// Init: bootstrap the object model
enum S {
  ADD_METHOD = 'addMethod',
  SEND = 'send',
  DELEGATE = 'delegate',
  ALLOCATE = 'allocate',
  LOOK_UP = 'lookUp'
}

// Utilities

function createVt (vTable: Object, parentVt: Object): Object {
  // Make newVt as a delegate of parentVt
  const newVt = send(parentVt, S.DELEGATE);
  
  // Add methods to vTable
  for (let method in vTable) {
    send(newVt, S.ADD_METHOD, method, vTable[method]);
  }
  return newVt;
}

function newObj (vTable: Object): Object {
  return send(vTable, S.ALLOCATE);
}

// Initialize
let rootVt: Object, objectVt: Object;

rootVt = {
  _parent: null,
  _vTable: null,
  addMethod: addMethod,
  delegate: delegate,
  allocate: allocate,
  lookUp: lookUp,
}

objectVt = {
  _parent: null,
  _vTable: rootVt,
  set (obj: Object, key: string, value: any) {
    obj.data[key] = value;
  },
  get (obj: Object, key: string) {
    return obj.data[key];
  },
  toJSON (obj: Object) {
    return JSON.stringify(obj.data);
  }
};

rootVt._vTable = rootVt;
rootVt._parent = objectVt;

export {
  newObj,
  createVt,
  send,
  rootVt,
  objectVt,
  S,
  Object
}
