import R from 'ramda';
import * as RA from 'ramda-adjunct';
import LGU from './utils';
import {
  cloneWithFn,
  isNotInternalProp,
  updatePath,
  addLensGroupLenses,
  addLensGroupInternals,
  validateLenGroupInputs } from './internal';


//*****************************************************************************
// Lens Group Creation
//*****************************************************************************

// :fxn: Create a lens group
//
// Given a list of property names in propList, create a group of lenses
// focused on those property names.  defaults for each property name and
// a path to the target object may be optionally provided.
// Returns undefined on invalid inputs.
// ( [''], ['']|u, ['']|u  ) -> {}
export const create = (propList, defaults, path) =>
  // :ex:
  // const lg = LG.create(['p1', 'p2'], ['def1', 'def2' ], ['path', 'to', 'target']);
  validateLenGroupInputs('LG.create()', propList, defaults, path) ?
      R.compose(
        addLensGroupInternals(path),
        addLensGroupLenses
      )(propList, defaults, path) : undefined;


//*****************************************************************************
// Lens Group Operations
//*****************************************************************************

// :fxn: View a property
//
// View prp on obj using lg.  Returns `undefined` if prop does not exist
// {lg} -> '' -> {} -> a|undefined
export const view = R.curry((lg, prp, obj) =>
  // :ex:
  // const obj = { p1: 'p1', p2: 'p2' };
  // const lg = LG.create(['p1', 'p2']);
  // LG.view(lg,'p1', obj); //=> 'p1'
  RA.isObj(obj) &&
  RA.isObj(lg) &&
  RA.isString(prp) &&
  RA.isFunction(lg[prp])
    ? lg[prp].view(obj) : undefined );

// View prop on obj, returns fallack if prop does not exist
// {lg} -> '' -> {} -> a|fallback
export const viewOr = R.curry((lg, fallback, prp, obj) =>
  RA.isObj(obj) &&
  RA.isObj(lg) &&
  RA.isString(prp) &&
  RA.isFunction(lg[prp])
    ? lg[prp].viewOr(fallback, obj) : undefined);

// View prop on obj, return default if prop does not exist, or undefined if prop was not defaulted
// {lg} -> '' -> {} -> a|default
export const viewOrDef = R.curry((lg, prp, obj) =>
  RA.isObj(obj) &&
  RA.isObj(lg) &&
  RA.isString(prp) &&
  RA.isFunction(lg[prp])
   ? lg[prp].viewOrDef(obj) : undefined);

// return version of obj with prop set to val, or original obj on invalid inputs
// {lg} -> '' -> a -> {wont-be-mutated} -> {}
export const set = R.curry((lg, prp, val, obj) =>
  RA.isObj(obj) &&
  RA.isObj(lg) &&
  RA.isString(prp) &&
  RA.isFunction(lg[prp])
    ? lg[prp].set(val,obj) : obj);

// Return the value, targeted by lg, within obj
// Returns  undefined on input errors
// {lg} -> {} -> a|undefined
export const viewTarget = (lg, obj) =>
  RA.isNotObj(lg) ? undefined : lg._viewSelf(obj);


//*****************************************************************************
// Cloning Objects With Lens Groups
//*****************************************************************************

// Return copy of toClone based on props targted by lg.
// Only props that are present on toClone will be copied.
// {lg} -> {} -> {}
export const clone = (lg, toClone) =>
  cloneWithFn(lg, 'view', LGU.identityOrPlacehoder(toClone));

// Return copy of toClone based on props targted by lg.
// Props values present on toClone will be copied, otherwise they are defaulted
// {lg} -> {} -> {}
export const cloneWithDef = (lg, toClone) =>
  cloneWithFn(lg, 'viewOrDef', LGU.identityOrPlacehoder(toClone) );

// Return an new object containing all props on the lg, set to defaults
// {lg} -> {} -> {}
export const def = lg => cloneWithDef(lg, {});

//*****************************************************************************
// Lens Group Specialization
//*****************************************************************************

// Returns new lens group which includes all of the lenses from lg, plus
// additional lenses for each property name in propList. defaults can optionally
// be provided for the new lenses. If a lens in lg already exists for a property name,
// the existing lens default will will be replaced (or removed when no default supplied)
// Returns undefined on input errors.
// {lg} -> ['']|u -> {lg}|u
// TODO: currying is tricky due to optoinal inputs, see what you can do here
export const add = (lg, propList, defaults) =>
  RA.isObj(lg) &&
  LGU.isStringArray(propList)
    ? addLensGroupLenses(propList, defaults, lg._path, lg) : undefined;

// Return a new lens group, based on the lenses in lg, without lenses
// to the property names in propList. Returns undefined on input errors
// {lg} -> [''] -> {lg}
// TODO: lg should be last for easer composition.  Do this the same time you fix add currying
export const remove = R.curry((lg, propList) =>
  RA.isObj(lg) &&
  LGU.isStringArray(propList)
    ? propList.reduce((acc,prp)=>R.dissoc(prp,acc), lg) : undefined);

// Return a new lens group, based on lg, w path appened to lg's path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
export const appendPath = R.curry((path, lg) =>
  RA.isObj(lg) &&
  LGU.isStringArray(path)
    ? updatePath(R.concat(lg._path, path), lg) : undefined);

// Return a new lens group, based on lg, w path appened to lg's path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
export const prependPath = R.curry((path, lg) =>
  RA.isObj(lg) &&
  LGU.isStringArray(path)
    ? updatePath(R.concat(path, lg._path), lg) : undefined);

// Return a new lens group, based on lg, w path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
export const replacePath = R.curry((path, lg) =>
  RA.isObj(lg) &&
  LGU.isStringArray(path)
    ? updatePath(path,lg) : undefined);


//*****************************************************************************
// Misc
//*****************************************************************************

export const path = lg=>lg._path;

//*****************************************************************************

export const LG = module.exports;
export default LG;

