import * as R from 'ramda';
import * as RA from 'ramda-adjunct';

// Misc
export const identityOrPlacehoder = R.when(R.isNil, ()=>R.__);

// Array checks
export const arrayEntryIsNotNil = (i,a)=> RA.isArray(a) && RA.isNotNil(a[i]);
export const isNonEmptyArray = v => RA.isArray(v) && RA.isNotEmpty(v);
export const stringArrayOrEmpty = v => isStringArray(v) ? v : [];

// Given the predicate fxn checkType, check that all elements of array pass
// [] -> (a->boolean) -> boolean
export const isArrayType = (checkType, array) => RA.isArray(array) && R.not(R.any(R.complement(checkType),array));

// Check that all elements of an array are of specified type
// Tests will pass on empty arrays
export const isStringArray = array => isArrayType(RA.isString, array);
export const isNotStringArray = R.complement(isStringArray);
export const isObjArray = array => isArrayType(RA.isObj, array);
export const isNotObjArray = R.complement(isObjArray);

export const LGU = module.exports;
export default LGU;
