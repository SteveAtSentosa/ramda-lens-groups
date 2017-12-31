## Import

```javascript
import LG from 'ramda-lens-groups';
```

## Lens Group Creation

#### create
```javascript
// Given a list of property names in propList, create a group of lenses
// focused on those property names.  defaults for each property name and
// a path to the target object may be optionally provided.
// Returns undefined on invalid inputs.
// ( [''], ['']|u, ['']|u  ) -> {}
const create = (propList, defaults, path) =>

// example
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def'], ['path']);
```

## Lens Group Operations

#### view
```javascript
// View prp on obj using lg.  Returns `undefined` if prop does not exist
// {lg} -> '' -> {} -> a|u
const view = R.curry((lg, prp, obj) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.view(lg, 'p1', obj); //=> 'p1val'

const obj2 = { path: { p2: 'p2val'}};
const lg2 = LG.create(['p2'],[], ['path']);
LG.view(lg2, 'p2', obj2); //=> 'p2val'
```

#### viewL
```javascript
// Return an object which contains 'views' of all of the propNames
// in propList that are on lg.  propNames not on lg won't be included.
// propNames not on obj will have val of undefined
// {lg} -> [''] -> {} -> {}
export const viewL = R.curry((lg, propList, obj) =>

// example
const obj = { p1: 'p1val', p2: 'p2val', p3: 'p3val' };
const lg = LG.create(['p1', 'p2', 'p3']);
LG.viewL(lg, ['p1', 'p3'], obj); //=> { p1: 'p1val', p3: 'p3val' }
```

#### viewOr
```javascript
// View prop on obj, returns fallack if prop does not exist or has value of undefined | null
// {lg} -> '' -> {} -> a|fallback
const viewOr = R.curry((lg, fallback, prp, obj) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.viewOr(lg, 'fb', 'p2', obj); //=> 'fb'
```

#### viewOrL
```javascript
// Return an object which contains 'views' of all of the propNames
// in propList that are on lg.  propNames not on lg won't be included.
// propNames not on obj will be given the associated value in fallbackList
// {lg} -> [''] -> [''] -> {} -> {}
export const viewOrL = R.curry((lg, fallbackList, propList, obj) =>

// example
const obj = { p1: 'p1val' };
const lg = LG.create(['p1', 'p2']);
LG.viewOrL(lg, ['fb1', 'fb2' ], ['p1', 'p2'], obj); //=> { p1: 'p1val', p2: 'fb2' }
```

#### viewOrDef
```javascript
// View prop on obj, return default if prop does not exist or has value of undefined | null
// In the case where default should returned, undefined is returned if the prop has no default
// {lg} -> '' -> {} -> a|default
const viewOrDef = R.curry((lg, prp, obj) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.viewOrDef(lg, 'p2', obj); //=> 'p2def'
```

#### viewOrDefL
```javascript
// Return an object which contains 'views' of all of the propNames
// in propList that are on lg.  propNames not on lg won't be included.
// propNames not on obj will be given default values
// {lg} -> [''] -> {} -> {}
export const viewOrDefL = R.curry((lg, propList, obj) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.viewOrDefL(lg, ['p1', 'p2'], obj); //=> { p1: 'p1val', p2: 'p2def' }
```

#### set
```javascript
// return version of obj with prop set to val, or original obj on invalid inputs
// {lg} -> '' -> a -> {wont-be-mutated} -> {}
const set = R.curry((lg, prp, val, obj) =>

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
```

#### setL
```javascript
// Return version of obj with lg props in propList set to vals in vallist,
// Returns original obj on invalid inputs.
// {lg} -> [''] -> [a] -> {wont-be-mutated} -> {}
export const setL = R.curry((lg, propList, valList, obj) =>

// example
const lg = LG.create(['p1', 'p2']);
const obj = { p1: 'p1val'};
const objNext = LG.setL(lg, ['p1', 'p2'], ['p1SetVal', 'p2SetVal'], obj);

console.log(obj); //=> { p1: 'p1val' }
console.log(objNext); //=> { p1: 'p1SetVal', p2: 'p2SetVal' }
```

#### setO
```javascript
// Return version of obj with lg props on propsToSet set to vals  on propsToSet
// Returns original obj on invalid inputs.
// {lg} -> {} -> {wont-be-mutated} -> {}
export const setO = R.curry((lg, propsToSet, obj) =>

// example
const lg = LG.create(['p1', 'p2']);
const obj = { p1: 'p1val'};
const objNext = LG.setO(lg, { p1: 'p1SetVal', p2: 'p2SetVal' }, obj);

console.log(obj); //=> { p1: 'p1val' }
console.log(objNext); //=> { p1: 'p1SetVal', p2: 'p2SetVal' }
```



## Lens Group Target Operations

#### viewTarget
```javascript
// Return the value, targeted by lg, within obj
// Returns  undefined on input errors
// {lg} -> {} -> a|undefined
const viewTarget = R.curry((lg, obj) =>

// example
const obj = {path: {to: {target: { p1: 'p1val'} }}};
const lg = LG.create(['p1', 'p2'], [], ['path', 'to', 'target']);
LG.viewTarget(lg,obj); //=> { p1: 'p1val' }
```

#### setTarget
```javascript
// return version of obj with the lg target set to targetVal.
// clone of targetVal returned if lg has no path
// Returns undefined on input errors
// {lg} -> {} -> {wont-be-mutated} -> {}
const setTarget = R.curry((lg, targetVal, obj) =>

// example
const obj = {path: {to: {target: { p1: 'p1val'} }}};
const lg = LG.create(['p1', 'p2'], [], ['path', 'to', 'target']);
LG.setTarget(lg,{ p1: 'newp1'}, obj); //=> { path: { to: { target: { p1: "newp1" }}}}
```

## Cloning and Defaulting With Lens Groups

#### clone
```javascript
// Return copy of toClone based on props targted by lg.
// Only props that are present on toClone will be copied.
// {lg} -> {} -> {}
const clone = (lg, toClone) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.clone(lg, obj); //=> { p1: 'p1val' }
```

#### cloneWithDef
```javascript
// Return copy of toClone based on props targted by lg.
// Props values present on toClone will be copied, otherwise they are defaulted
// {lg} -> {} -> {}
const cloneWithDef = (lg, toClone) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.cloneWithDef(lg, obj); //=> { p1: 'p1val', p2: 'p2def' }
```

#### cloneWithDefExcept
```javascript
// Return copy of toClone based on props targted by lg.
// Props values present on toClone will be copied.
// Missing props are defaluted, except for those in noDefProps.
// {lg} -> {} -> {}
export const cloneWithDefExcept = R.curry((lg, noDefProps, toClone) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2', 'p3'], ['p1def', 'p2def', 'p3def']);
LG.cloneWithDefExcept(lg, ['p2'], obj); //=> { p1: 'p1val', p3: 'p3def' }
```

#### def
```javascript
// Return an new object containing all props on the lg, set to defaults
// {lg} -> {} -> {}
const def = lg => cloneWithDef(lg, {});

// example
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.def(lg); //=> { p1: 'p1def', p2: 'p2def' }
```

#### addDef
```javascript
// Return a new object, with all of the original props on obj, plus
// defaults for props that are on lg but not on obj
// Returns original obj on input errors
// {lg} -> {} -> {}
export const addDef = (lg, obj) =>

// example
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
const obj = { p0: 'p0val', p1: 'p1val'};
const objNext = LG.addDef(lg,obj);

console.log(obj); //=>  { p0: 'p0val', p1: 'p1val' }
console.log(objNext); //=> { p0: 'p0val', p1: 'p1val', p2: 'p2def' }
```

#### addDefExcept
```javascript
// Return an new object, with all of the original props on obj, plus
// defaults for props that are on lg but not on obj and are not in noDefProps
// Returns original obj on input errors
// {lg} -> [''] -> {} -> {}
export const addDefExcept = (lg, noDefProps, obj) =>
```

## Lens Group Specialization

#### add
```javascript
// Returns new lens group which includes all of the lenses from lg, plus
// additional lenses for each property name in propList. defaults can
// be provided for the new lenses. If a lens in lg already exists for a property name,
// the existing lens default will will be replaced (or removed when no default supplied)
// Returns undefined on input errors.
// [''] -> [''] -> {lg} -> {lg}
const add = R.curry((propList, defaults, lg) =>

// example
const lg = LG.create(['p1'], ['p1def']);
LG.def(lg); //=> { p1: 'p1def' }
const lg2 = LG.add(['p2'], ['p2def'], lg);
LG.def(lg2); //=> { p1: 'p1def', p2: 'p2def' }
```

#### remove
```javascript
// Return a new lens group, based on the lenses in lg, without lenses
// to the property names in propList. Returns undefined on input errors
// [''] -> {lg} -> {lg}
const remove = R.curry((propList, lg) =>

// example
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.def(lg); //=> { p1: 'p1def', p2: 'p2def' }
const lg2 = LG.remove(['p1'], lg);
LG.def(lg2); //=> { p2: 'p2def' }
```

#### replacePath
```javascript
// Return a new lens group, based on lg, w path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
const replacePath = R.curry((path, lg) =>

const obj = {path: {to: {target: { p1: 'p1val'} }}};
const lg = LG.create(['p1', 'p2'], [], ['replace', 'me']);
const lg2 = LG.replacePath(['path', 'to', 'target'], lg);
LG.view(lg2, 'p1', obj);  //=> 'p1val'
```

#### appendPath
```javascript
// Return a new lens group, based on lg, w path appened to lg's path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
const appendPath = R.curry((path, lg) =>

// example
const obj = {path: {to: {target: { p1: 'p1val'} }}};
const lg = LG.create(['p1'], [], ['path', 'to']);
const lg2 = LG.appendPath(['target'], lg);
LG.view(lg2, 'p1', obj); //=> 'p1val'
```

#### prependPath
```javascript
// Return a new lens group, based on lg, w path appened to lg's path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
const prependPath = R.curry((path, lg) =>

const obj = {path: {to: {target: { p1: 'p1val'} }}};
const lg = LG.create(['p1'], [], ['target']);
const lg2 = LG.prependPath(['path', 'to'], lg);
LG.view(lg2, 'p1', obj); //=> 'p1val'

```

## Misc

####
```javascript
// Return the path of an lg
// {lg} -> ''
const path = lg =>
```
