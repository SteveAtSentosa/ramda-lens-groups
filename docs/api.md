_(TBD: add exmples)_

## Lens Group Creation

```javascript
// Given a list of property names in propList, create a group of lenses
// focused on those property names.  defaults for each property name and
// a path to the target object may be optionally provided.
// Returns undefined on invalid inputs.
// ( [''], ['']|u, ['']|u  ) -> {}
const create = (propList, defaults, path) =>
```

## Lens Group Operations

```javascript
// View prp on obj using lg.  Returns `undefined` if prop does not exist
// {lg} -> '' -> {} -> a|u
const view = R.curry((lg, prp, obj) =>
```

```javascript
// View prop on obj, returns fallack if prop does not exist
// {lg} -> '' -> {} -> a|fallback
const viewOr = R.curry((lg, fallback, prp, obj) =>
```

```javascript
// View prop on obj, return default if prop does not exist, or undefined if prop was not defaulted
// {lg} -> '' -> {} -> a|default
const viewOrDef = R.curry((lg, prp, obj) =>
```

```javascript
// return version of obj with prop set to val, or original obj on invalid inputs
// {lg} -> '' -> a -> {wont-be-mutated} -> {}
const set = R.curry((lg, prp, val, obj) =>
```

```javascript
// Return the value, targeted by lg, within obj
// Returns  undefined on input errors
// {lg} -> {} -> a|undefined
const viewTarget = R.curry((lg, obj) =>
```

```javascript
// return version of obj with the lg target set to targetVal.
// clone of targetVal returned if lg has no path
// Returns undefined on input errors
// {lg} -> {} -> {wont-be-mutated} -> {}
const setTarget = R.curry((lg, targetVal, obj) =>
```

## Cloning Objects With Lens Groups

```javascript
// Return copy of toClone based on props targted by lg.
// Only props that are present on toClone will be copied.
// {lg} -> {} -> {}
const clone = (lg, toClone) =>
```

```javascript
// Return copy of toClone based on props targted by lg.
// Props values present on toClone will be copied, otherwise they are defaulted
// {lg} -> {} -> {}
const cloneWithDef = (lg, toClone) =>
```

```javascript
// Return an new object containing all props on the lg, set to defaults
// {lg} -> {} -> {}
const def = lg => cloneWithDef(lg, {});
```

## Lens Group Specialization

```javascript
// Returns new lens group which includes all of the lenses from lg, plus
// additional lenses for each property name in propList. defaults can
// be provided for the new lenses. If a lens in lg already exists for a property name,
// the existing lens default will will be replaced (or removed when no default supplied)
// Returns undefined on input errors.
// [''] -> [''] -> {lg} -> {lg}
const add = R.curry((propList, defaults, lg) =>
```

```javascript
// Return a new lens group, based on the lenses in lg, without lenses
// to the property names in propList. Returns undefined on input errors
// [''] -> {lg} -> {lg}
const remove = R.curry((propList, lg) =>
```

```javascript
// Return a new lens group, based on lg, w path appened to lg's path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
const appendPath = R.curry((path, lg) =>
```

```javascript
// Return a new lens group, based on lg, w path appened to lg's path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
const prependPath = R.curry((path, lg) =>
```

```javascript
// Return a new lens group, based on lg, w path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
const replacePath = R.curry((path, lg) =>
```

## Misc

```javascript
// Return the path of an lg
const path = lg =>
```

