import R from 'ramda';
import * as RA from 'ramda-adjunct';
import { cloneWithFn, isNotInternalProp, addLenses } from './internal';
import LGU from './utils';

//*****************************************************************************
// Lens Group Creation
//*****************************************************************************

// :fxn:
// Given a list of property names in propList, create a group of lenses
// focused on those property names.  Default values for each property name and
// a path to the target object may be optionally provided.
// Returns undefined invalid inputs.
// ( [''], ['']|u, ['']|u  ) -> {}
const create = (propList, defaults, path) => {

  const f = 'LG.create()'; let error = false;
  if ( R.isNil(propList) || LGU.isNotStringArray(propList))
    (error=true) && console.error(`${f}: propList must be supplied as an array of strings`);
  if ( RA.isNotNil(defaults) && RA.isNotArray(defaults))
    (error=true) && console.error(`${f}: defaults must be an array`);
  if ( RA.isNotNil(path) && LGU.isNotStringArray(path))
    (error=true) && console.error(`${f}: path must be an array of strings`);
  if ( error ) return undefined;

  const _path = RA.isNotNil(path) ? path : [];
  const _viewSelf = LGU.isNonEmptyArray(_path) ? R.view(R.lensPath(_path)) : R.identity;

  return addLenses(propList, defaults, _path, { _path, _viewSelf });
};


//*****************************************************************************
// Lens Group Operations
//*****************************************************************************

// :fxn:
// View prop on obj, returns undefined if prop does not exist
// {lg} -> '' -> {} -> a|undefined
const view = R.curry((lg, prp, obj) =>
  RA.isObj(obj) &&
  RA.isObj(lg) &&
  RA.isString(prp) &&
  RA.isFunction(lg[prp])
    ? lg[prp].view(obj) : undefined );

// :fxn:
// View prop on obj, returns fallack if prop does not exist
// {lg} -> '' -> {} -> a|fallback
const viewOr = R.curry((lg, fallback, prp, obj) =>
  RA.isObj(obj) &&
  RA.isObj(lg) &&
  RA.isString(prp) &&
  RA.isFunction(lg[prp])
    ? lg[prp].viewOr(fallback, obj) : undefined);

// :fxn:
// View prop on obj, return default if prop does not exist, or undefined if prop was not defaulted
// {lg} -> '' -> {} -> a|default
const viewOrDef = R.curry((lg, prp, obj) =>
  RA.isObj(obj) &&
  RA.isObj(lg) &&
  RA.isString(prp) &&
  RA.isFunction(lg[prp])
   ? lg[prp].viewOrDef(obj) : undefined);

// :fxn:
// return version of obj with prop set to val, or original obj on invalid inputs
// {lg} -> '' -> a -> {wont-be-mutated} -> {}
const set = R.curry((lg, prp, val, obj) =>
  RA.isObj(obj) &&
  RA.isObj(lg) &&
  RA.isString(prp) &&
  RA.isFunction(lg[prp])
    ? lg[prp].set(val,obj) : obj);

// :fxn:
// Return the value, targeted by lg, within obj
// Returns  undefined on input errors
// {lg} -> {} -> a|undefined
const viewTarget = (lg, obj) => RA.isNotObj(lg) ? undefined : lg._viewSelf(obj);


//*****************************************************************************
// Cloning Objects With Lens Groups
//*****************************************************************************

// :fxn:
// Return copy of toClone based on props targted by lg.
// Only props that are present on toClone will be copied.
// {lg} -> {} -> {}
const clone = (lg, toClone) => cloneWithFn(lg, 'view', LGU.identityOrPlacehoder(toClone));

// :fxn:
// Return copy of toClone based on props targted by lg.
// Props values present on toClone will be copied, otherwise they are defaulted
// {lg} -> {} -> {}
const cloneWithDef = (lg, toClone) => cloneWithFn(lg, 'viewOrDef', LGU.identityOrPlacehoder(toClone) );

//*****************************************************************************
// Lens Group Specialization
//*****************************************************************************

// :fxn: Create a new lg group by adding lenses to an existing lg
//
// Returns new lens group which includes all of the lenses from lg, plus
// additional lenses for each property name in propList. defaults can optionally
// be provided for the new lenses. Returns undefined on input errors.
// {lg} -> ['']|u -> {lg}|u
const add = (lg, propList, defaults) =>
  // :ex:
  // const lg = LG.create(['origProp'], ['origDef']);
  // const specialLg = LG.add(lg, ['newProp'], ['newDef']);
  // LG.clone(specialLg, {}); //=> {origProp: 'origDef', newProp, 'newDef'}
  RA.isObj(lg) &&
  LGU.isStringArray(propList)
    ? addLenses(propList, defaults, lg._path, lg) : undefined;

//*****************************************************************************

export const LG = {
  create, view, viewOr, viewOrDef, set,
  viewTarget, clone, cloneWithDef,
  add
};
export default LG;

