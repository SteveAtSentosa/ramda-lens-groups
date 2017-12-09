## Create a lens group

#### create = (propList, defaults, path) =>

**sig**: `( [''], ['']|u, ['']|u  ) -> {lg}`

Given a list of property names in `propList`, create a group of lenses focused on those property names.  `defaults` for each property name and a `path` to the target object may be optionally provided. Returns `undefined` on invalid inputs.

``` javascript
const lg = LG.create(['p1', 'p2'], ['def1', 'def2' ], ['path', 'to', 'target']);
```

## View properties on an object

#### view = R.curry((lg, prp, obj) =>
**sig**: `{lg} -> '' -> {} -> a|undefined`

View `prp` on `obj` using `lg`.  Returns `undefined` if prop does not exist

```javascript
const obj = { p1: 'p1', p2: 'p2' };
const lg = LG.create(['p1', 'p2']);
LG.view(lg,'p1', obj); //=> 'p1'
```

## TBD:
* doc rest of fxns
* test API samples