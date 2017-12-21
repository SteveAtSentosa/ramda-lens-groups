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

const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.view(lg, 'p1', obj); //=> 'p1val'

const obj2 = { path: { p2: 'p2val'}};
const lg2 = LG.create(['p2'],[], ['path']);
LG.view(lg2, 'p2', obj2); //=> 'p2val'
```

#### viewOr
```javascript
// View prop on obj, returns fallack if prop does not exist
// {lg} -> '' -> {} -> a|fallback
const viewOr = R.curry((lg, fallback, prp, obj) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.viewOr(lg, 'fb', 'p2', obj); //=> 'fb'
```

#### viewOrDef
```javascript
// View prop on obj, return default if prop does not exist, or undefined if prop was not defaulted
// {lg} -> '' -> {} -> a|default
const viewOrDef = R.curry((lg, prp, obj) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.viewOrDef(lg, 'p2', obj); //=> 'p2def'
```

#### set
```javascript
// return version of obj with prop set to val, or original obj on invalid inputs
// {lg} -> '' -> a -> {wont-be-mutated} -> {}
const set = R.curry((lg, prp, val, obj) =>

// example
const obj = { p1: 'p1val'};
const lg = LG.create(['p1', 'p2']);
LG.set(lg, 'p2', 'p2setVal', obj); //=> { p1: 'p1val', p2: 'p2setVal' }

const obj2 = { path: { p3: 'p3val'}};
const lg2 = LG.create(['p3'],[], ['path']);
LG.set(lg2, 'p3', 'p3setVal', obj2); //=> { path: { p3: 'p3setVal' } }
```

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

## Cloning Objects With Lens Groups

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

#### def
```javascript
// Return an new object containing all props on the lg, set to defaults
// {lg} -> {} -> {}
const def = lg => cloneWithDef(lg, {});

// example
const lg = LG.create(['p1', 'p2'], ['p1def', 'p2def']);
LG.def(lg); //=> { p1: 'p1def', p2: 'p2def' }
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
const path = lg =>
```

