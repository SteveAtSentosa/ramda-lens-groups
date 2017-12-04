import R from 'ramda';
import * as RA from 'ramda-adjunct';

// Misc
const identityOrPlacehoder = R.when(R.isNil, ()=>R.__);

// Array checks
const arrayEntryIsNotNil = (i,a)=> RA.isArray(a) && RA.isNotNil(a[i]);
const isNonEmptyArray = v => RA.isArray(v) && RA.isNotEmpty(v);

// Given the predicate fxn checkType, check that all elements of array pass
// [] -> (a->boolean) -> boolean
const isArrayType = (checkType, array) => RA.isArray(array) && R.not(R.any(R.complement(checkType),array));

// Check that all elements of an array are of specified type
// Tests will pass on empty arrays
const isStringArray = array => isArrayType(RA.isString, array);
const isNotStringArray = R.complement(isStringArray);
const isObjArray = array => isArrayType(RA.isObj, array);
const isNotObjArray = R.complement(isObjArray);

export const LGU = {
  isStringArray,
  isNotStringArray,
  isObjArray,
  isNotObjArray,
  arrayEntryIsNotNil,
  isNonEmptyArray,
  identityOrPlacehoder
};
export default LGU;
