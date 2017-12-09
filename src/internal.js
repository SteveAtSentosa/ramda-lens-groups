import R from 'ramda';
import * as RA from 'ramda-adjunct';
import LGU from './utils';
import { def, create } from './lensGroups';

export const isInternalProp = key => key.charAt(0) === '_';
export const isNotInternalProp = R.complement(isInternalProp);

// Given a list of property names in propList, add lenses to toMe object (or new
// object if toMe is undefined) that are focused on those property names.
// Default values for each property name and a path to the target object
// may be optionally provided.
// ( [''], ['']|u, ['']|u, {}|u  ) -> {}
export const addLensGroupLenses = (propList, defaults, path, toMe ) => {

  const p = LGU.stringArrayOrEmpty(path);
  return propList.reduce((acc, prp, i) => {
    const propPath = [...p, prp];
    let next = R.merge(acc, {[prp]:R.lensPath(propPath)});
    next[prp].set = R.set(next[prp]);
    next[prp].view = R.view(next[prp]);
    next[prp].viewOr = RA.viewOr(R.__, next[prp]);
    next[prp].viewOrDef =  LGU.arrayEntryIsNotNil(i, defaults) ?
      RA.viewOr(defaults[i], next[prp]) : R.view(next[prp]);
    return next;
    } , R.isNil(toMe) ? {}:toMe) ;
};

// Add internal helpers to lg (can be empty {}), given the lg's path
// [''] -> {} -> {}
export const addLensGroupInternals = R.curry((path,lg) => {
  const _path = LGU.stringArrayOrEmpty(path);
  const _viewSelf = LGU.isNonEmptyArray(_path) ? R.view(R.lensPath(_path)) : R.identity;
  return {
    _path, _viewSelf, ...lg
  };
});

// Given existing lg and a path, return a new lens group containing the
// lenses and defaults associated with lg, focused on path
// [''] -> {lg} -> {lg}
export const updatePath = R.curry((path,lg) => {
  const p = R.keys(lg).filter(isNotInternalProp).reduce((acc, prp) => ({
      propList: R.concat(acc.propList, [prp]),
      defaults: R.concat(acc.defaults,[lg[prp].viewOrDef(undefined)])
  }), {propList: [], defaults: []});
  return create(p.propList, p.defaults, path);
});

// Return copy of toClone based on props targted by lg, using fxnName.
// {lg} -> {wont-be-mutated} -> {}
export const cloneWithFn = R.curry((lg, fxnName, toClone) => {
  return R.keys(lg).filter(isNotInternalProp).reduce((acc, prp) => {
    const view = lg[prp][fxnName];
    return view(toClone) ? { ...acc, [prp]: R.clone(view(toClone)) }: acc;
  },{});
});

// TODO: figure out smoother way to handle error reporting
export const validateLenGroupInputs = (f, propList, defaults, path) => {
    let valid = true;
    if ( R.isNil(propList) || LGU.isNotStringArray(propList)) {
      console.error(`${f}: propList must be supplied as an array of strings`);
      valid = false;
    }
    if ( RA.isNotNil(defaults) && RA.isNotArray(defaults) ) {
      console.error(`${f}: defaults must be an array`);
      valid = false;
    }
    if ( RA.isNotNil(path) && LGU.isNotStringArray(path)) {
      console.error(`${f}: path must be an array of strings`);
      valid = false;
    }
    return valid;
};