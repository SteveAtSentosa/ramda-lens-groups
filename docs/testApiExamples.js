import LG from '../src/lensGroups';

( function testDocExamples() {

{ // create
  // example
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def'], ['path']);
}

{ // view
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.view(lg, 'p1', obj); //=> 'p1val'

  const obj2 = { path: { p2: 'p2val'}};
  const lg2 = LG.create(['p2'],[], ['path']);
  LG.view(lg2, 'p2', obj2); //=> 'p2val'

  console.log(LG.view(lg, 'p1', obj));
  console.log(LG.view(lg2, 'p2', obj2));
}

{ // viewOr
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.viewOr(lg, 'fb', 'p2', obj); //=> 'fb'
  console.log(LG.viewOr(lg, 'fb', 'p2', obj));
}

{ // viewOrDef
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.viewOrDef(lg, 'p2', obj); //=> 'p2def'
  console.log(LG.viewOrDef(lg, 'p2', obj));
}

{ // set
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2']);
  LG.set(lg, 'p2', 'p2setVal', obj); //=> { p1: 'p1val', p2: 'p2setVal' }

  const obj2 = { path: { p3: 'p3val'}};
  const lg2 = LG.create(['p3'],[], ['path']);
  LG.set(lg2, 'p3', 'p3setVal', obj2); //=> { path: { p3: 'p3setVal' } }

  console.log(LG.set(lg, 'p2', 'p2setVal', obj));
  console.log(LG.set(lg2, 'p3', 'p3setVal', obj2));

}

{ // viewTarget
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1', 'p2'], [], ['path', 'to', 'target']);
  LG.viewTarget(lg,obj); //=> { p1: 'p1val' }
  console.log(LG.viewTarget(lg,obj));
}

{ // setTarget
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1', 'p2'], [], ['path', 'to', 'target']);
  LG.setTarget(lg,{ p1: 'newp1'}, obj); //=> { path: { to: { target: { p1: "newp1" }}}}
  console.log(LG.setTarget(lg,{ p1: 'newp1'}, obj));
  console.log(JSON.stringify(LG.setTarget(lg,{ p1: 'newp1'}, obj),null,2));
}

{ // clone
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.clone(lg, obj); //=> { p1: 'p1val' }
  console.log(LG.clone(lg, obj));
}

{ // cloneWithDef
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.cloneWithDef(lg, obj); //=> { p1: 'p1val', p2: 'p2def' }
  console.log(LG.cloneWithDef(lg, obj));
}

{ // def
  // example
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.def(lg); //=> { p1: 'p1def', p2: 'p2def' }
  console.log(LG.def(lg));
}

{ // add
  // example
  const lg = LG.create(['p1'], ['p1def']);
  LG.def(lg); //=> { p1: 'p1def' }
  const lg2 = LG.add(['p2'], ['p2def'], lg);
  LG.def(lg2); //=> { p1: 'p1def', p2: 'p2def' }

  console.log(LG.def(lg));
  console.log(LG.def(lg2));
}

{ // remove
  // example
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.def(lg); //=> { p1: 'p1def', p2: 'p2def' }
  const lg2 = LG.remove(['p1'], lg);
  LG.def(lg2); //=> { p2: 'p2def' }

  console.log(LG.def(lg));
  console.log(LG.def(lg2));
}

{ // replacePath
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1', 'p2'], [], ['replace', 'me']);
  const lg2 = LG.replacePath(['path', 'to', 'target'], lg);
  LG.view(lg2, 'p1', obj);  //=> 'p1val'

  console.log(LG.view(lg2, 'p1', obj));
}

{ // appendPath
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1'], [], ['path', 'to']);
  const lg2 = LG.appendPath(['target'], lg);
  LG.view(lg2, 'p1', obj); //=> 'p1val'

  console.log(LG.view(lg2, 'p1', obj));
}

{ // prependPath
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1'], [], ['target']);
  const lg2 = LG.prependPath(['path', 'to'], lg);
  LG.view(lg2, 'p1', obj); //=> 'p1val'

  console.log(LG.view(lg2, 'p1', obj));
}
})();
