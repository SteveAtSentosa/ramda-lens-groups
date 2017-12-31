import LG from '../src/lensGroups';

( function testDocExamples() {

{ // create
  // example
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def'], ['path']);
}

console.log("\n\nview");
console.log("---------------------");
{
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

console.log("\n\nviewL");
console.log("---------------------");
{
  // example
  const obj = { p1: 'p1val', p2: 'p2val', p3: 'p3val' };
  const lg = LG.create(['p1', 'p2', 'p3']);
  LG.viewL(lg, ['p1', 'p3'], obj); //=> { p1: 'p1val', p3: 'p3val' }

  console.log(LG.viewL(lg, ['p1', 'p3'], obj));
}

console.log("\n\nviewOr");
console.log("---------------------");
{
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.viewOr(lg, 'fb', 'p2', obj); //=> 'fb'
  console.log(LG.viewOr(lg, 'fb', 'p2', obj));
}

console.log("\n\nviewOrL");
console.log("---------------------");
{
  // example
  const obj = { p1: 'p1val' };
  const lg = LG.create(['p1', 'p2']);
  LG.viewOrL(lg, ['fb1', 'fb2' ], ['p1', 'p2'], obj); //=> { p1: 'p1val', p2: 'fb2' }
  console.log(LG.viewOrL(lg, ['fb1', 'fb2' ], ['p1', 'p2'], obj));
}

console.log("\n\nviewOrDef");
console.log("---------------------");
{
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.viewOrDef(lg, 'p2', obj); //=> 'p2def'
  console.log(LG.viewOrDef(lg, 'p2', obj));
}

console.log("\n\nviewOrDefL");
console.log("---------------------");
{
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.viewOrDefL(lg, ['p1', 'p2'], obj); //=> { p1: 'p1val', p2: 'p2def' }
  console.log(LG.viewOrDefL(lg, ['p1', 'p2'], obj));
}

console.log("\n\nset");
console.log("---------------------");
{
  // example
  const lg = LG.create(['p1', 'p2']);

  const obj = { p1: 'p1val'};
  const objNext = LG.set(lg, 'p2', 'p2setVal', obj);
  console.log(obj); //=> { p1: 'p1val' }
  console.log(objNext); //=> { p1: 'p1val', p2: 'p2setVal' }

  const lg2 = LG.create(['p1'],[], ['path']);
  const obj2 = { path: { p1: 'p1val'}};
  const obj2Next = LG.set(lg2, 'p1', 'p1setVal', obj2);
  console.log(obj2); //=> { path: { p1: 'p1val' } }
  console.log(obj2Next); //=> { path: { p1: 'p1setVal' } }
}

console.log("\n\nsetL");
console.log("---------------------");
{
  // example
  const lg = LG.create(['p1', 'p2']);
  const obj = { p1: 'p1val'};
  const objNext = LG.setL(lg, ['p1', 'p2'], ['p1SetVal', 'p2SetVal'], obj);

  console.log(obj); //=> { p1: 'p1val' }
  console.log(objNext); //=> { p1: 'p1SetVal', p2: 'p2SetVal' }
}

console.log("\n\nsetO)");
console.log("---------------------");
{
  // example
  const lg = LG.create(['p1', 'p2']);
  const obj = { p1: 'p1val'};
  const objNext = LG.setO(lg, { p1: 'p1SetVal', p2: 'p2SetVal' }, obj);

  console.log(obj); //=> { p1: 'p1val' }
  console.log(objNext); //=> { p1: 'p1SetVal', p2: 'p2SetVal' }
}

console.log("\n\nviewTarget");
console.log("---------------------");
{
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1', 'p2'], [], ['path', 'to', 'target']);
  LG.viewTarget(lg,obj); //=> { p1: 'p1val' }
  console.log(LG.viewTarget(lg,obj));
}

console.log("\n\nsetTarget");
console.log("---------------------");
{
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1', 'p2'], [], ['path', 'to', 'target']);
  LG.setTarget(lg,{ p1: 'newp1'}, obj); //=> { path: { to: { target: { p1: "newp1" }}}}
  console.log(LG.setTarget(lg,{ p1: 'newp1'}, obj));
  console.log(JSON.stringify(LG.setTarget(lg,{ p1: 'newp1'}, obj),null,2));
}

console.log("\n\nclone");
console.log("---------------------");
{
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.clone(lg, obj); //=> { p1: 'p1val' }
  console.log(LG.clone(lg, obj));
}

console.log("\n\ncloneWithDef");
console.log("---------------------");
{
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.cloneWithDef(lg, obj); //=> { p1: 'p1val', p2: 'p2def' }
  console.log(LG.cloneWithDef(lg, obj));
}

console.log("\n\ncloneWithDefExcept");
console.log("----------------------");
{
  // example
  const obj = { p1: 'p1val'};
  const lg = LG.create(['p1', 'p2', 'p3'], ['p1def', 'p2def', 'p3def']);
  LG.cloneWithDefExcept(lg, ['p2'], obj); //=> { p1: 'p1val', p3: 'p3def' }
  console.log(LG.cloneWithDefExcept(lg, ['p2'], obj));
}

console.log("\n\ndef");
console.log("---------------------");
{
  // example
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.def(lg); //=> { p1: 'p1def', p2: 'p2def' }
  console.log(LG.def(lg));
}

console.log("\n\naddDef");
console.log("---------------------");
{
  // example
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  const obj = { p0: 'p0val', p1: 'p1val'};
  const objNext = LG.addDef(lg,obj);

  console.log(obj); //=>  { p0: 'p0val', p1: 'p1val' }
  console.log(objNext); //=> { p0: 'p0val', p1: 'p1val', p2: 'p2def' }
}

console.log("\n\naddDefExcept");
console.log("---------------------");
{
// example
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
const obj = { };
const objNext = LG.addDefExcept(lg,['p2'], obj);

console.log(obj); //=> {}
console.log(objNext); //=> { p1: 'p1def' }
}

console.log("\n\nadd");
console.log("---------------------");
{
  // example
  const lg = LG.create(['p1'], ['p1def']);
  LG.def(lg); //=> { p1: 'p1def' }
  const lg2 = LG.add(['p2'], ['p2def'], lg);
  LG.def(lg2); //=> { p1: 'p1def', p2: 'p2def' }

  console.log(LG.def(lg));
  console.log(LG.def(lg2));
}

console.log("\n\nremove");
console.log("---------------------");
{
  // example
  const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
  LG.def(lg); //=> { p1: 'p1def', p2: 'p2def' }
  const lg2 = LG.remove(['p1'], lg);
  LG.def(lg2); //=> { p2: 'p2def' }

  console.log(LG.def(lg));
  console.log(LG.def(lg2));
}

console.log("\n\nreplacePath");
console.log("---------------------");
{
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1', 'p2'], [], ['replace', 'me']);
  const lg2 = LG.replacePath(['path', 'to', 'target'], lg);
  LG.view(lg2, 'p1', obj);  //=> 'p1val'

  console.log(LG.view(lg2, 'p1', obj));
}

console.log("\n\nappendPath");
console.log("---------------------");
{
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1'], [], ['path', 'to']);
  const lg2 = LG.appendPath(['target'], lg);
  LG.view(lg2, 'p1', obj); //=> 'p1val'

  console.log(LG.view(lg2, 'p1', obj));
}

console.log("\n\nprependPath");
console.log("---------------------");
{
  // example
  const obj = {path: {to: {target: { p1: 'p1val'} }}};
  const lg = LG.create(['p1'], [], ['target']);
  const lg2 = LG.prependPath(['path', 'to'], lg);
  LG.view(lg2, 'p1', obj); //=> 'p1val'

  console.log(LG.view(lg2, 'p1', obj));
}
})();
