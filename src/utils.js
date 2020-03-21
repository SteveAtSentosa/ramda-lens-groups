import * as R from 'ramda'
import * as RA from 'ramda-adjunct'

// Misc
export const identityOrPlacehoder = R.when(R.isNil, () => R.__)

// Array checks
export const arrayEntryIsNotNil = (i, a) => RA.isArray(a) && RA.isNotNil(a[i])
export const arrayEntryIsNil = (i, a) => R.not(arrayEntryIsNotNil(i, a))

export const arrayEntryIsNotUndef = (i, a) => RA.isArray(a) && RA.isNotUndefined(a[i])
export const arrayEntryIsUndef = (i, a) => R.not(arrayEntryIsNotUndef(i, a))

export const isNonEmptyArray = v => RA.isArray(v) && RA.isNotEmpty(v)
export const stringArrayOrEmpty = v => isStringArray(v) ? v : []

export const arrayEntryOrUndef = (i, a) => arrayEntryIsNotUndef(i, a) ? a[i] : undefined

// Given the predicate fxn checkType, check that all elements of array pass
// [] -> (a->boolean) -> boolean
export const isArrayType = (checkType, array) => RA.isArray(array) && R.not(R.any(R.complement(checkType), array))

// Check that all elements of an array are of specified type
// Tests will pass on empty arrays
export const isStringArray = array => isArrayType(RA.isString, array)
export const isNotStringArray = R.complement(isStringArray)
export const isObjArray = array => isArrayType(RA.isObj, array)
export const isNotObjArray = R.complement(isObjArray)
export const isFnArray = array => isArrayType(RA.isFunction, array)
export const isNotFnArray = R.complement(isFnArray)
export const isBoolArray = array => isArrayType(RA.isBoolean, array)
export const isNotBoolArray = R.complement(isBoolArray)

export const isStringArrayOfLength = (len, array) => isStringArray(array) && R.equals(len, R.length(array))
export const isNotStringArrayOfLength = R.complement(isStringArrayOfLength)
export const isBoolArrayOfLength = (len, array) => isBoolArray(array) && R.equals(len, R.length(array))
export const isNotBoolArrayOfLength = R.complement(isBoolArrayOfLength)
export const isFnArrayOfLength = (len, array) => isFnArray(array) && R.equals(len, R.length(array))
export const isNotFnrrayOfLength = R.complement(isFnArrayOfLength)

// if prp is on source, return object with prp added to target with value source[prp]
// '' -> {} -> {} -> {}
export const pasteProp = R.curry((prp, source, target) =>
  R.findIndex(v => R.equals(v, prp), R.keys(source)) >= 0 ?
    { ...target, [prp]: source[prp] } : target)

// for all propNames in props, return object with propName added to target with value source[propName]
// [''] -> {} -> {} -> {}
export const pasteProps = R.curry((props, source, target) =>
  props.reduce((acc, p) => pasteProp(p, source, acc), target))

export const doesNotHave = R.complement(R.has)
export const doesNotInclude = R.complement(R.includes)
export const arrayIsSubsetOf = (superArray, subArray) =>
  RA.isArray(superArray) && RA.isArray(subArray) && subArray.every(val => superArray.includes(val))

export const arrayIsNotSubsetOf = R.complement(arrayIsSubsetOf)

export const warnAndReturn = (msg, toReturn) => {
  console.warn(`LG WARNING: ${msg}`)
  return toReturn
}

export const LGU = module.exports
export default LGU
