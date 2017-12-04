import R from 'ramda';
import * as RA from 'ramda-adjunct';
import LGU from './utils';

export const isInternalProp = key => key.charAt(0) === '_';
export const isNotInternalProp = R.complement(isInternalProp);

// Given a list of property names in propList, add lenses to toMe,
// that are focused on those property names.  Default values for
// each property name and a path to the target object may be optionally provided.
// ( [''], ['']|u, ['']|u, {}|u  ) -> {}
export const addLenses = (propList, defaults, path, toMe ) => {
  return propList.reduce((acc, prp, i) => {
    const propPath = [...path, prp];
    let next = R.merge(acc, {[prp]:R.lensPath(propPath)});
    next[prp].set = R.set(next[prp]);
    next[prp].view = R.view(next[prp]);
    next[prp].viewOr = RA.viewOr(R.__, next[prp]);
    next[prp].viewOrDef =  LGU.arrayEntryIsNotNil(i, defaults) ?
      RA.viewOr(defaults[i], next[prp]) : R.view(next[prp]);
    return next;
    } , toMe);
};

// Return copy of toClone based on props targted by lg, using fnName.
// {lg} -> {wont-be-mutated} -> {}
export const cloneWithFn = R.curry((lg, fnName, toClone) => {
  return R.keys(lg).filter(isNotInternalProp).reduce((acc, prp) => {
    const view = lg[prp][fnName];
    return view(toClone) ? { ...acc, [prp]: view(toClone) }: acc;
  },{});
});
