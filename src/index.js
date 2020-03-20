// TODO list:
// * allow set to set values not on LG ?
// * consitent treatment of nil/null (view on null returns null, viewOrDef on null, returns default)
//   seperate view, viewOr, ViewOrDef, clone, etc  fxs which operates based on isNotUndfined vs isNotNil ??
//   is this important?
//
// BUG list:
// * expect(LG.viewOrDef(lg, 'null', falsey)) test should pass (see notes in the test)

import LG from './lensGroups'
export default LG
