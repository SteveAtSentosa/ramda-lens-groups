import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import LGU, { warnAndReturn } from './utils'
import { create } from './lensGroups'

export const isInternalProp = key => key.substring(0, 3)  === '_$_'
export const isNotInternalProp = R.complement(isInternalProp)
export const hasValidators = R.propEq('_$_hasValidators', true)
export const lgHasProp = R.curry((lg, propName) => RA.isObj(R.prop(propName, lg)))
export const lgDoesNotHaveProp = R.complement(lgHasProp)
export const propRequired = R.curry((lg, prp) => lg[prp].required)
export const getLgProps = R.pipe(R.keys, R.filter(isNotInternalProp))
export const getRequiredLgProps = lg => R.pipe(getLgProps, R.filter(propRequired(lg)))(lg)
export const isExtraProp = (lg, prp) => LGU.doesNotHave(prp, lg)
export const extraPropsPermitted = lg => R.propEq('_$_extraProps', true, lg)
export const extraPropsNotPermitted = R.complement(extraPropsPermitted)
export const getPropRequirement = R.curry((lg, prp) => R.path([prp, 'required'], lg))
export const getPropValidatorFn = R.curry((lg, prp) => R.path([prp, 'validator'], lg))


// check for lg, report warning if not
export const isLg = lg => {
  if (R.propOr(false, '_$_lgTag', lg))
    return true
  else {
    console.warn('LG: Non lens group supplied for lg operation', lg)
    return false
  }
}

export const isLgWithValidators = lg => {
  if (isLg(lg) && hasValidators(lg))
    return true
  else
    return warnAndReturn('LG: lens group is invalid or without validators', false)
}

// Given a list of property names in propList, add lenses to toMe object (or new
// object if toMe is undefined) that are focused on those property names.
// Default values for each property name and a path to the target object
// may be optionally provided.
// assumes lgInputs has already been validated
// ( [''], ['']|u, ['']|u, {}|u  ) -> {}
export const addLensGroupLensesOld = (propList, defaults, path, toMe) => {

  const p = LGU.stringArrayOrEmpty(path)
  return propList.reduce((acc, prp, i) => {
    const propLens = R.lensPath([...p, prp])
    const next = R.mergeRight(acc, { [prp]: { lens: propLens } })
    next[prp].set = R.set(propLens)
    next[prp].view = R.view(propLens)
    next[prp].viewOr = (fallback, obj) => R.isNil(R.view(propLens, obj||{})) ?
      fallback : R.view(propLens, obj)   // fallback on non-nil props

    // next[prp].viewOrDef =  LGU.arrayEntryIsNil(i, defaults) ?
    next[prp].viewOrDef = defaults && i <= defaults.length-1 ?
      obj => R.isNil(R.view(propLens, obj||{})) ? defaults[i] : R.view(propLens, obj) : // default on non-nil props
      obj => R.view(propLens, obj) // straight view if no default val present

    return next
  }, R.isNil(toMe) ? {} : { ...toMe })
}

export const addLensGroupLenses = (lgInputs, toMe) => {
  const { propList, defaults, path } = lgInputs
  const p = LGU.stringArrayOrEmpty(path)
  return propList.reduce((acc, prp, i) => {
    const propLens = R.lensPath([...p, prp])
    const next = R.mergeRight(acc, { [prp]: { lens: propLens } })
    next[prp].set = R.set(propLens)
    next[prp].view = R.view(propLens)
    next[prp].viewOr = (fallback, obj) => R.isNil(R.view(propLens, obj||{})) ?
      fallback : R.view(propLens, obj)   // fallback on non-nil props

    // next[prp].viewOrDef =  LGU.arrayEntryIsNil(i, defaults) ?
    next[prp].viewOrDef = defaults && i <= defaults.length-1 ?
      obj => R.isNil(R.view(propLens, obj||{})) ? defaults[i] : R.view(propLens, obj) : // default on non-nil props
      obj => R.view(propLens, obj) // straight view if no default val present

    return next
  }, R.isNil(toMe) ? {} : { ...toMe })
}

// Given an existing lens group and a set of props on that lens group add validation info
// Any prop names in propList that are not on lg will be ignored
// assumes all inputs have already been verified
// `validation` can be undefined, in which case the lg is returned directly
// [''] -> {} -> {lg} -> -> {updated-lg}
export const addLensGroupValidatorsOld = R.curry((propList, validation, lg) => {
  if (R.isNil(validation)) return lg
  const { validators, required, extraProps } = validation

  const lgWithValidators = propList.reduce((acc, prp, i) => {
    if (LGU.doesNotHave(prp, lg)) {
      return LGU.warnAndReturn(
        `LG::addLensGroupValidators(): ${prp} not on lens group`, acc)
    }
    const next = { ...acc }
    next[prp] = R.assoc('validator', validators[i], next[prp])
    next[prp] = R.assoc('required', required[i], next[prp])
    return next
  }, lg)

  return {
    _$_extraProps: !!extraProps,
    _$_hasValidators: true,
    ...lgWithValidators,
  }
})

// Given an existing lens group and a set of props on that lens group add validation info
// Any prop names in propList that are not on lg will be ignored
// assumes all inputs have already been verified
// `validation` can be undefined, in which case the lg is returned directly
// [''] -> {} -> {lg} -> -> {updated-lg}
export const addLensGroupValidators = R.curry((lgInputs, lg) => {
  const { propList, required, validators, extraProps } = lgInputs

  if (R.any(R.isNil, [propList, required, validators, extraProps])) return lg

  const lgWithValidators = propList.reduce((acc, prp, i) => {
    if (LGU.doesNotHave(prp, lg)) {
      return LGU.warnAndReturn(
        `LG::addLensGroupValidators(): ${prp} not on lens group`, acc)
    }
    const next = { ...acc }
    next[prp] = R.assoc('validator', validators[i], next[prp])
    next[prp] = R.assoc('required', required[i], next[prp])
    return next
  }, lg)

  return {
    _$_extraProps: !!extraProps,
    _$_hasValidators: true,
    ...lgWithValidators,
  }
})

// Add internal helpers to lg (can be empty {}), given the lg's path
// [''] -> {lg} -> {updated-lg}
export const addLensGroupInternalsOld = R.curry((path, lg) => {
  const _$_lgTag = true
  const _$_path = LGU.stringArrayOrEmpty(path)
  const _$_viewSelf = LGU.isNonEmptyArray(_$_path) ? R.view(R.lensPath(_$_path)) : R.identity
  const _$_setSelf = LGU.isNonEmptyArray(_$_path) ? R.set(R.lensPath(_$_path)): R.clone
  return {
    _$_lgTag, _$_path, _$_viewSelf, _$_setSelf, ...lg
  }
})

// Add internal helpers to lg (can be empty {}), given the lg's path
// assums lgInput has been validated
// [''] -> {lg} -> {updated-lg}
export const addLensGroupInternals = R.curry((lgInput, lg) => {
  const { path } = lgInput
  const _$_lgTag = true
  const _$_path = LGU.stringArrayOrEmpty(path)
  const _$_viewSelf = LGU.isNonEmptyArray(_$_path) ? R.view(R.lensPath(_$_path)) : R.identity
  const _$_setSelf = LGU.isNonEmptyArray(_$_path) ? R.set(R.lensPath(_$_path)): R.clone
  return {
    _$_lgTag, _$_path, _$_viewSelf, _$_setSelf, ...lg
  }
})


// Given existing lg and a path, return a new lens group containing the
// lenses and defaults associated with lg, focused on path
// [''] -> {lg} -> {lg}
export const updatePath = R.curry((path, lg) => {
  let lgInputs = getLgProps(lg).reduce((acc, prp) => ({
    ...acc,
    propList: R.concat(acc.propList, [prp]), // todo: use R.append when I have thils working
    defaults: R.concat(acc.defaults, [lg[prp].viewOrDef(undefined)]),
    required: R.concat(acc.required, [getPropRequirement(lg, prp)]),
    validators: R.concat(acc.validators, [getPropValidatorFn(lg, prp)])
  }), { path, propList: [], defaults: [], required: [], validators: [] })

  const numProps = R.length(R.prop('propList', lgInputs))
  const validators = R.propOr([], 'validators', lgInputs)
  const required = R.propOr([], 'required', lgInputs)
  const extraProps = R.propOr(false, 'extraProps', lgInputs)


  if (LGU.isNotFnrrayOfLength(numProps, validators) || LGU.isNotBoolArrayOfLength(numProps, required)) {
    lgInputs = R.dissoc('validators', lgInputs)
    lgInputs = R.dissoc('required', lgInputs)
    lgInputs = R.dissoc('extraProps', lgInputs)
  } else {
    lgInputs = R.assoc('extraProps', extraProps, lgInputs)
  }

  return create(lgInputs)
})

// Return copy of toClone based on props targted by lg, using fxnName.
// {lg} -> {wont-be-mutated} -> {}
export const cloneWithFn = R.curry((lg, fxnName, toClone) => {
  return R.keys(lg).filter(isNotInternalProp).reduce((acc, prp) => {
    const view = lg[prp][fxnName]
    return view(toClone) !== undefined ? { ...acc, [prp]: R.clone(view(toClone)) }: acc
  }, {})
})

export const validateLensGroupInputsOld = (f, propList, defaults, path, validation) => {
  if (LGU.isNotStringArray(propList)) {
    return warnAndReturn(`${f}: propList must be supplied as an array of strings`, false)
  }
  if (RA.isNotNil(defaults) && RA.isNotArray(defaults)) {
    return warnAndReturn(`${f}: defaults must be an array`, false)
  }
  if (RA.isNotNil(path) && LGU.isNotStringArray(path)) {
    return warnAndReturn(`${f}: path must be an array of strings`, false)
  }
  if (!validateValidatorInputs(f, propList, validation)) return false
  return true
}

export const validateLensGroupInputs = (f, lgInputs = {}) => {

  const { propList, defaults, path } = lgInputs

  if (LGU.isNotStringArray(propList)) {
    return warnAndReturn(`${f}: propList must be supplied as an array of strings`, false)
  }
  if (RA.isNotNil(defaults) && RA.isNotArray(defaults)) {
    return warnAndReturn(`${f}: defaults must be an array of values`, false)
  }
  if (RA.isNotNil(path) && LGU.isNotStringArray(path)) {
    return warnAndReturn(`${f}: path must be an array of strings`, false)
  }

  const { required, validators, extraProps } = lgInputs

  if (R.any(RA.isNotNil, [required, validators, extraProps])) {
    if (R.any(R.isNil, [required, validators, extraProps])) {
      return warnAndReturn(`${f}: only partial validation info provided`, false)
    }
    if (LGU.isNotFnrrayOfLength(R.length(propList), validators)) {
      return warnAndReturn(`${f}: validators must be an array of functions, same length as propList`, false)
    }
    if (LGU.isNotBoolArrayOfLength(R.length(propList), required)) {
      return warnAndReturn(`${f}: required must be an array of functions, same length as propList`, false)
    }
    if (RA.isNotBoolean(extraProps)) {
      return warnAndReturn(`${f}: extraProps must be a boolean`, false)
    }
  }
  return true
}

export const validateValidatorInputs = (f, propList, validation) => {
  if (R.isNil(validation)) return true // its OK not to have validtion info
  if (RA.isNotObj(validation)) return false
  const { validators, required, extraProps } = validation

  if (R.isNil(propList) || LGU.isNotStringArray(propList)) {
    return warnAndReturn(`${f}: propList must be an array of strings`, false)
  }
  if (LGU.isNotFnrrayOfLength(R.length(propList), validators)) {
    return warnAndReturn(`${f}: validators must be an array of functions, same length as propList`, false)
  }
  if (LGU.isNotBoolArrayOfLength(R.length(propList), required)) {
    return warnAndReturn(`${f}: required must be an array of functions, same length as propList`, false)
  }
  if (RA.isNotBoolean(extraProps)) {
    return warnAndReturn(`${f}: extraProps must be a boolean`, false)
  }
  return true
}

// export const validateValidatorInputs = (f, propList, validators, required, extraProps) => {
//   if (R.isNil(propList) || LGU.isNotStringArray(propList)) {
//     return warnAndReturn(`${f}: propList must be an array of strings`, false)
//   }
//   if (LGU.isNotFnrrayOfLength(R.length(propList), validators)) {
//     return warnAndReturn(`${f}: validators must be an array of functions, same length as propList`, false)
//   }
//   if (LGU.isNotBoolArrayOfLength(R.length(propList), required)) {
//     return warnAndReturn(`${f}: required must be an array of functions, same length as propList`, false)
//   }
//   if (RA.isNotBoolean(extraProps)) {
//     return warnAndReturn(`${f}: extraProps must be a boolean`, false)
//   }
//   return true
// }

// assumes lg has already been validatte
// returns true if
// * prop not required and is not present
// * prop is present and satisfies valitation fn
// returns false if
// * prop required but not present
// * prop present and fails valitation fn
// * lens group validators are not valid
export const validateOneProp = (prp, obj, lg) => {

  if (lgDoesNotHaveProp(lg, prp)) {
    return warnAndReturn(`LG::validateOneProp(): lg does not have prop ${prp}`, false)
  }

  const required = getPropRequirement(lg, prp)
  const validator = getPropValidatorFn(lg, prp)

  if (RA.isNotBoolean(required) || RA.isNotFunction(validator)) {
    return warnAndReturn('LG::validateOneProp(): invalid validators on lens group', false)
  }

  const propVal = lg[prp].view(obj)
  if (RA.isUndefined(propVal)) return !required
  return validator(propVal)
}

// assumes lg has already been validated
export const validateAllProps = (lg, obj) => {
  const incomingProps = R.keys(lg._$_viewSelf(obj))
  const requiredProps = getRequiredLgProps(lg)

  if (LGU.arrayIsNotSubsetOf(incomingProps, requiredProps)) return false

  for (let i = 0; i < incomingProps.length; i++) {
    const incomingPropName = incomingProps[i]
    if (isExtraProp(lg, incomingPropName)) {
      if (extraPropsNotPermitted(lg)) return false
    } else {
      if (!validateOneProp(incomingPropName, obj, lg)) return false
    }
  }
  return true
}
