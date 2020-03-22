import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import LGU, { warnAndReturn } from './utils'
import { def, create } from './lensGroups'

export const isInternalProp = key => key.substring(0, 3)  === '_$_'
export const isNotInternalProp = R.complement(isInternalProp)
export const hasValidators = R.propEq('_$_hasValidators', true)
export const lgHasProp = R.curry((lg, propName) => RA.isObj(R.prop(propName, lg)))
export const lgDoesNotHaveProp = R.complement(lgHasProp)
export const propRequired = R.curry((lg, prp) => lg[prp].required)
export const getLgProps = R.pipe(R.keys, R.filter(isNotInternalProp))
export const getRequiredLgProps = lg => R.pipe(getLgProps, R.filter(propRequired(lg)))(lg)
export const isExtraProp = (lg, prp) => LGU.doesNotHave(prp, lg)
export const extraPropsPermitted = lg => R.propEq('_$_extraPropsAllowed', true, lg)
export const extraPropsNotPermitted = R.complement(extraPropsPermitted)
export const getPropRequirement = R.curry((lg, prp) => R.path([prp, 'required'], lg))
export const getPropValidatorFn = R.curry((lg, prp) => R.path([prp, 'validatorFn'], lg))


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
// ( [''], ['']|u, ['']|u, {}|u  ) -> {}
export const addLensGroupLenses = (propList, defaults, path, toMe) => {

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
export const addLensGroupValidators = R.curry((propList, validation, lg) => {
  if (R.isNil(validation)) return lg
  const { validatorFnList, requiredList, extraPropsAllowed } = validation

  const lgWithValidators = propList.reduce((acc, prp, i) => {
    if (LGU.doesNotHave(prp, lg)) {
      return LGU.warnAndReturn(
        `LG::addLensGroupValidators(): ${prp} not on lens group`, acc)
    }
    const next = { ...acc }
    next[prp] = R.assoc('validatorFn', validatorFnList[i], next[prp])
    next[prp] = R.assoc('required', requiredList[i], next[prp])
    return next
  }, lg)

  return {
    _$_extraPropsAllowed: !!extraPropsAllowed,
    _$_hasValidators: true,
    ...lgWithValidators,
  }
})


// Add internal helpers to lg (can be empty {}), given the lg's path
// [''] -> {lg} -> {updated-lg}
export const addLensGroupInternals = R.curry((path, lg) => {
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
  // const p = R.keys(lg).filter(isNotInternalProp).reduce((acc, prp) => ({
  const p = getLgProps(lg).reduce((acc, prp) => ({
    propList: R.concat(acc.propList, [prp]),
    defaults: R.concat(acc.defaults, [lg[prp].viewOrDef(undefined)])
  }), { propList: [], defaults: [] })


  // const getPropRequirement = (lg, prp) => R.path([prp, 'required'], lg)
  // const getPropValidatorFn = (lg, prp) => R.path([prp, 'validatorFn'], lg)

  const validation = hasValidators(lg) ? {
    validatorFnList: getLgProps(lg).map(getPropValidatorFn(lg)),
    requiredList: getLgProps(lg).map(getPropRequirement(lg)),
    extraPropsAllowed: extraPropsPermitted(lg),

  } : undefined

  return create(p.propList, p.defaults, path, validation)
})

// Return copy of toClone based on props targted by lg, using fxnName.
// {lg} -> {wont-be-mutated} -> {}
export const cloneWithFn = R.curry((lg, fxnName, toClone) => {
  return R.keys(lg).filter(isNotInternalProp).reduce((acc, prp) => {
    const view = lg[prp][fxnName]
    return view(toClone) !== undefined ? { ...acc, [prp]: R.clone(view(toClone)) }: acc
  }, {})
})

export const validateLensGroupInputs = (f, propList, defaults, path, validation) => {
  if (LGU.isNotStringArray(propList)) {
    return warnAndReturn(`${f}: propList must be supplied as an array of strings`, false)
  }
  if (RA.isNotNil(defaults) && RA.isNotArray(defaults)) {
    return warnAndReturn(`${f}: defaults must be an array`, false)
  }
  if (RA.isNotNil(path) && LGU.isNotStringArray(path)) {
    return warnAndReturn(`${f}: path must be an array of strings`, false)
  }
  if (!validateValidatorInputsNew(f, propList, validation)) return false
  return true
}


export const validateValidatorInputsNew = (f, propList, validation) => {
  if (R.isNil(validation)) return true // its OK not to have validtion info
  if (RA.isNotObj(validation)) return false
  const { validatorFnList, requiredList, extraPropsAllowed } = validation

  if (R.isNil(propList) || LGU.isNotStringArray(propList)) {
    return warnAndReturn(`${f}: propList must be an array of strings`, false)
  }
  if (LGU.isNotFnrrayOfLength(R.length(propList), validatorFnList)) {
    return warnAndReturn(`${f}: validatorFnList must be an array of functions, same length as propList`, false)
  }
  if (LGU.isNotBoolArrayOfLength(R.length(propList), requiredList)) {
    return warnAndReturn(`${f}: requiredList must be an array of functions, same length as propList`, false)
  }
  if (RA.isNotBoolean(extraPropsAllowed)) {
    return warnAndReturn(`${f}: extraPropsAllowed must be a boolean`, false)
  }
  return true
}

export const validateValidatorInputs = (f, propList, validatorFnList, requiredList, extraPropsAllowed) => {
  if (R.isNil(propList) || LGU.isNotStringArray(propList)) {
    return warnAndReturn(`${f}: propList must be an array of strings`, false)
  }
  if (LGU.isNotFnrrayOfLength(R.length(propList), validatorFnList)) {
    return warnAndReturn(`${f}: validatorFnList must be an array of functions, same length as propList`, false)
  }
  if (LGU.isNotBoolArrayOfLength(R.length(propList), requiredList)) {
    return warnAndReturn(`${f}: requiredList must be an array of functions, same length as propList`, false)
  }
  if (RA.isNotBoolean(extraPropsAllowed)) {
    return warnAndReturn(`${f}: extraPropsAllowed must be a boolean`, false)
  }
  return true
}

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
  const validatorFn = getPropValidatorFn(lg, prp)

  if (RA.isNotBoolean(required) || RA.isNotFunction(validatorFn)) {
    return warnAndReturn('LG::validateOneProp(): invalid validators on lens group', false)
  }

  const propVal = lg[prp].view(obj)
  if (RA.isUndefined(propVal)) return !required
  return validatorFn(propVal)
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
