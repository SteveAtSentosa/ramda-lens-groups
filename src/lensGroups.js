// TODO:
// * add validation support for LG.add
// * don't set a type if valdator exixts and input is wrong type
// * warnings for all invalid input
// * allow set/get of props not on the LG?

import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import LGU from './utils'
import {
  isLg,
  isLgWithValidators,
  cloneWithFn,
  updatePath,
  addLensGroupLenses,
  addLensGroupInternals,
  addLensGroupValidators,
  validateLensGroupInputs,
  validateOneProp,
  validateAllProps,
  getRequiredLgProps
} from './internal'


//*****************************************************************************
// Lens Group Creation
//*****************************************************************************

// Given a list of property names in propList, create a group of lenses
// focused on those property names.  defaults for each property name,
// a path to the target object, and validators may be optionally provided.
// if validators is provided all of the following props are requied
// validators: {
//   validatorFnList: [fxns],
//     same length as propList
//     List of predicate fxns to validate props in propList same length as propList
//     should accept a value, and return true if valid, false if not (for example isString)
//   requiredList: [bool]
//     same length as propList
//     list of booleans informing which props in propList are and are not required
//   extraPropsAllowed: bool
//     single boolean specifying ether props in addition to those on lg or OK
//  }
// Returns undefined on invalid inputs.
// ( [''], ['']|u, ['']|u  {}|u) -> {}
export const create = (propList, defaults, path, validation) =>
  validateLensGroupInputs('LG.create()', propList, defaults, path, validation) ?
    R.compose(
      addLensGroupInternals(path),
      addLensGroupValidators(propList, validation),
      addLensGroupLenses
    )(propList, defaults, path) : undefined


//*****************************************************************************
// Lens Group Validators
//*****************************************************************************

// Validate a property on an object based on lg validators
// returns true if
// * prop not required and is not present
// * prop is present and satisfies lg validators
// returns false if
// * prop required but not present
// * prop present and fails valitation fn
// * invalid input
// * lg has no validators
// {lg} -> '' -> {} -> bool
export const validateProp = R.curry((lg, prp, obj) =>
  isLgWithValidators(lg) &&
  RA.isString(prp) &&
  RA.isObj(obj) &&
  RA.isObj(lg[prp])
    ? validateOneProp(prp, obj, lg): false
)

// validate an object against a lens group validators
// returns true if
// * all required props are present
// * all props associated with the lg are valid
// returns false if
// * required props are missing
// * any prop present fails its valiation fn
// * extra props are present, but not allowed
// {lg} -> {} -> bool
export const validate = R.curry((lg, obj) =>
  isLgWithValidators(lg) &&
  RA.isObj(obj)
    ? validateAllProps(lg, obj): false
)

export const requiredProps = lg =>
  isLgWithValidators(lg) ? getRequiredLgProps(lg): []

//*****************************************************************************
// Lens Group View/Set Operations
//*****************************************************************************

// View prp on obj using lg.  Returns `undefined` if prop does not exist
// {lg} -> '' -> {} -> a|u
export const view = R.curry((lg, prp, obj) =>
  isLg(lg) &&
  RA.isObj(obj) &&
  RA.isString(prp) &&
  RA.isObj(lg[prp])
    ? lg[prp].view(obj) : undefined)

// Return an object which contains 'views' of all of the propNames
// in propList that are on lg.  propNames not on lg won't be included.
// propNames not on obj will have val of undefined
// {lg} -> [''] -> {} -> {}
export const viewL = R.curry((lg, propList, obj) =>
  LGU.isStringArray(propList) ?
    propList.reduce((acc, prp) =>
      R.assoc(prp, view(lg, prp, obj), acc), {}) : obj)

// View prop on obj, returns fallack if prop does not exist or has value of undefined | null
// {lg} -> '' -> {} -> a|fallback
export const viewOr = R.curry((lg, fallback, prp, obj) =>
  isLg(lg) &&
  RA.isObj(obj) &&
  RA.isString(prp) &&
  RA.isObj(lg[prp])
    ? lg[prp].viewOr(fallback, obj) : undefined)

// Return an object which contains 'views' of all of the propNames
// in propList that are on lg.  propNames not on lg won't be included.
// propNames not on obj will be given the associated value in fallbackList
// {lg} -> [''] -> [''] -> {} -> {}
export const viewOrL = R.curry((lg, fallbackList, propList, obj) =>
  LGU.isStringArray(propList) ?
    propList.reduce((acc, prp, i) =>
      R.assoc(prp, viewOr(lg, LGU.arrayEntryOrUndef(i, fallbackList), prp, obj), acc), {}) : obj)

// View prop on obj, return default if prop does not exist or has value of undefined | null
// In the case where default should returned, undefined is returned if the prop has no default
// {lg} -> '' -> {} -> a|default
export const viewOrDef = R.curry((lg, prp, obj) =>
  isLg(lg) &&
  RA.isObj(obj) &&
  RA.isString(prp) &&
  RA.isObj(lg[prp])
   ? lg[prp].viewOrDef(obj) : undefined)

// Return an object which contains 'views' of all of the propNames
// in propList that are on lg.  propNames not on lg won't be included.
// propNames not on obj will be given default values
// {lg} -> [''] -> {} -> {}
export const viewOrDefL = R.curry((lg, propList, obj) =>
  LGU.isStringArray(propList) ?
    propList.reduce((acc, prp) =>
      R.assoc(prp, viewOrDef(lg, prp, obj), acc), {}) : obj)

// return version of obj with prop set to val, or original obj on invalid inputs
// {lg} -> '' -> a -> {wont-be-mutated} -> {}
export const set = R.curry((lg, prp, val, obj) =>
  isLg(lg) &&
  RA.isObj(obj) &&
  RA.isString(prp) &&
  RA.isObj(lg[prp])
    ? lg[prp].set(val, obj) : obj)

// Return version of obj with lg props in propList set to vals in vallist,
// Returns original obj on invalid inputs.
// {lg} -> [''] -> [a] -> {wont-be-mutated} -> {}
export const setL = R.curry((lg, propList, valList, obj) =>
  LGU.isStringArray(propList) ?
    propList.reduce((acc, prp, i) =>
      set(lg, prp, LGU.arrayEntryOrUndef(i, valList), acc), obj) : obj)

// Return version of obj with lg props on propsToSet set to vals  on propsToSet
// Returns original obj on invalid inputs.
// {lg} -> {} -> {wont-be-mutated} -> {}
export const setO = R.curry((lg, propsToSet, obj) =>
  RA.isObj(propsToSet) ? setL(lg, R.keys(propsToSet), R.values(propsToSet), obj): obj)

//*****************************************************************************
// Lens Group Target Operations
//*****************************************************************************


// Return the value, targeted by lg, within obj
// Returns  undefined on input errors
// {lg} -> {} -> a|undefined
export const viewTarget = R.curry((lg, obj) =>
  isLg(lg) ? lg._$_viewSelf(obj) : undefined)

// return version of obj with the lg target set to targetVal.
// clone of targetVal returned if lg has no path
// Returns undefined on input errors
// {lg} -> {} -> {wont-be-mutated} -> {}
export const setTarget = R.curry((lg, targetVal, obj) =>
  isLg(lg) ? lg._$_setSelf(targetVal, obj) : undefined)

//*****************************************************************************
// Cloning Objects With Lens Groups
//*****************************************************************************

// Return copy of toClone based on props targted by lg.
// Only props that are present on toClone will be copied.
// {lg} -> {} -> {}
export const clone = (lg, toClone) =>
  cloneWithFn(lg, 'view', LGU.identityOrPlacehoder(toClone))

// Return copy of toClone based on props targted by lg.
// Props values present on toClone will be copied, otherwise they are defaulted
// {lg} -> {} -> {}
export const cloneWithDef = (lg, toClone) =>
  cloneWithFn(lg, 'viewOrDef', LGU.identityOrPlacehoder(toClone))

// Return copy of toClone based on props targted by lg.
// Props values present on toClone will be copied.
// Missing props are defaluted, except for those in noDefProps.
// {lg} -> {} -> {}
export const cloneWithDefExcept = R.curry((lg, noDefProps, toClone) =>
  cloneWithFn(LG.remove(noDefProps, lg), 'viewOrDef', LGU.identityOrPlacehoder(toClone)))

// Return an new object containing all props on the lg, set to defaults
// {lg} -> {} -> {}
export const def = lg => cloneWithDef(lg, {})

// Return a new object, with all of the original props on obj, plus
// defaults for props that are on lg but not on obj
// Returns original obj on input errors
// {lg} -> {} -> {}
export const addDef = (lg, obj) =>
  isLg(lg) &&
  RA.isObj(obj)
    ? ({ ...LG.def(lg), ...obj }) : obj

// Return an new object, with all of the original props on obj, plus
// defaults for props that are on lg but not on obj and are not in noDefProps
// Returns original obj on input errors
// {lg} -> [''] -> {} -> {}
export const addDefExcept = (lg, noDefProps, obj) =>
  isLg(lg) &&
  RA.isObj(obj) &&
  LGU.isStringArray(noDefProps)
    ? addDef(remove(noDefProps, lg), obj) : obj

//*****************************************************************************
// Lens Group Specialization
//*****************************************************************************

// Returns new lens group which includes all of the lenses from lg, plus
// additional lenses for each property name in propList. defaults can
// be provided for the new lenses. If a lens in lg already exists for a property name,
// the existing lens default will will be replaced (or removed when no default supplied)
// Returns undefined on input errors.
// [''] -> [''] -> {lg} -> {lg}
export const add = R.curry((propList, defaults, lg) =>
  isLg(lg) &&
  LGU.isStringArray(propList)
    ? addLensGroupLenses(propList, defaults, lg._$_path, lg) : undefined)

// Return a new lens group, based on the lenses in lg, without lenses
// to the property names in propList. Returns undefined on input errors
// [''] -> {lg} -> {lg}
export const remove = R.curry((propList, lg) =>
  isLg(lg) &&
  LGU.isStringArray(propList)
    ? propList.reduce((acc, prp) => R.dissoc(prp, acc), lg) : undefined)

// Return a new lens group, based on lg, w path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
export const replacePath = R.curry((path, lg) =>
isLg(lg) &&
LGU.isStringArray(path)
  ? updatePath(path, lg) : undefined)

// Return a new lens group, based on lg, w path appened to lg's path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
export const appendPath = R.curry((path, lg) =>
  isLg(lg) &&
  LGU.isStringArray(path)
    ? updatePath(R.concat(lg._$_path, path), lg) : undefined)

// Return a new lens group, based on lg, w path appened to lg's path
// Returns undefined on invalid input
// [''] -> {lg} -> {lg}
export const prependPath = R.curry((path, lg) =>
  isLg(lg) &&
  LGU.isStringArray(path)
    ? updatePath(R.concat(path, lg._$_path), lg) : undefined)

//*****************************************************************************
// type checking
//*****************************************************************************

// NOTE: experimental: these are not currently documented or in test the suite
export const isFn = R.curry((lg, prop, obj) => R.compose(RA.isFunction, view)(lg, prop, obj))
export const isStr = R.curry((lg, prop, obj) => R.compose(RA.isString, view)(lg, prop, obj))

//*****************************************************************************
// Misc
//*****************************************************************************

export const path = lg => lg._$_path





//*****************************************************************************

export const LG = module.exports
export default LG
