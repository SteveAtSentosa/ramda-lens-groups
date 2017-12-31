import  { assert, expect } from 'chai';
import R from 'ramda';
import RA from 'ramda-adjunct';
import LG from '../src/index';

export default function runLensGroupTests() {

  describe('Test Lens Groups', ()=>{
    testInvalidArgs();
    testWithoutDefaults();
    testWithDefaults();
    testListOperations();
    testLensTargetView();
    testLensTargetSet();
    testPaths();
    testCurry();
    testClone();
    testDefaultAdd();
    testLensPropSpecialization();
    testLensPathSpecialization();
    testMutability();
  });
}


//*****************************************************************************
// Base testing dataset
//*****************************************************************************

function getBaseTestSet() {
  const testSet = {
    lgProps: ['id', 'name', 'color',    'mood' ],
    lgDefs: [-1, 'defName', 'defColor', 'defMood' ],
    familyPath: [ 'myBrother', 'hisPets', 'brosCat'],
    myCat: { name: 'sunshine', color: 'orange' },
    brosCat: { id: 9, mood: 'grumpy' },
    defCatVals: [-1, 'defName', 'defColor', 'defMood' ],
    defCat: { id: -1, name: 'defName', color: 'defColor', mood: 'defMood' }
  };
  return {
    ...testSet,
    myFamily: { myBrother: {hisPets : { brosCat: testSet.brosCat }}},
    catLg: LG.create(testSet.lgProps, testSet.lgDefs),
    broCatLg: LG.create(testSet.lgProps, testSet.lgDefs, testSet.familyPath),
    myCatWithDef: { ...testSet.defCat, ... testSet.myCat  },
    brosCatWithDef: { ...testSet.defCat, ... testSet.brosCat  }
  };
}

//*****************************************************************************
// Test lens creation with bad inputs
//*****************************************************************************

function testInvalidArgs() {
  describe('Invalid lens creation', ()=>{

    it('should log error and return undefined on invalid create',()=>{
      expect(LG.create()).to.equal(undefined);
      expect(LG.create(['p'], {})).to.equal(undefined);
      expect(LG.create(['p'], ['d'], 10)).to.equal(undefined);
    });

    it('should log error and return undefined on non-lg',()=>{
      const obj = {};
      expect(LG.view({}, 'prp', obj)).to.equal(undefined);
      expect(LG.viewOr('lg', 'fallback', 'prp', obj)).to.equal(undefined);
      expect(LG.viewTarget(99, obj)).to.equal(undefined);

      // TODO: test the rest of these someday
      // export const viewTarget = (lg, obj) =>
      // export const clone = (lg, toClone) =>
      // export const cloneWithDef = (lg, toClone) =>
      // export const def = lg => cloneWithDef(lg, {});
      // export const add = (lg, propList, defaults) =>
      // export const remove = R.curry((lg, propList) =>
      // export const appendPath = R.curry((path, lg) =>
      // export const prependPath = R.curry((path, lg) =>
      // export const replacePath = R.curry((path, lg) =>
      });
  });
}

//*****************************************************************************
// Test lens groups w/o defaults
//*****************************************************************************

function testWithoutDefaults() {

  describe('No defaults', ()=>{

    const { lgProps, catLg, myCat} = getBaseTestSet();

    it('should have correct lenses',()=>{
      expect(catLg).to.include.keys(lgProps);
      expect(catLg).to.not.include.keys(['rouge-prop']);
    });
    it('should get correct props',()=>{
      expect( LG.view(catLg, 'name', myCat )).to.equal('sunshine');
      expect( LG.view(catLg, 'color', myCat )).to.equal('orange');
    });
    it('should return fallback props if missing',()=>{
      expect( LG.viewOr(catLg, 'fallback-name', 'name', myCat )).to.equal('sunshine');
      expect( LG.viewOr(catLg, 'fallback-name', 'name', { name : ''} )).to.equal('');
      expect( LG.viewOr(catLg, 'fallback-name', 'name', { name : null} )).to.equal('fallback-name');
      expect( LG.viewOr(catLg, 'fallback-name', 'name', { name : undefined} )).to.equal('fallback-name');
      expect( LG.viewOr(catLg, 'fallback-name', 'name', undefined)).to.equal(undefined);
      expect( LG.viewOr(catLg, 'fallback-id', 'id', myCat )).to.equal('fallback-id');
      expect( LG.viewOr(catLg, 'fallback-mood', 'mood', myCat )).to.equal('fallback-mood');
    });
    it('should return undefined for missing props, misnamed props, non obj target',()=>{
      expect( LG.view(catLg, 'id', myCat )).to.equal(undefined);
      expect( LG.view(catLg, 'mood', myCat )).to.equal(undefined);
      expect( LG.view(catLg, 'rouge-prop', myCat )).to.equal(undefined);
      expect( LG.view(catLg, 'name', 'myCat' )).to.equal(undefined);
      expect( LG.view(catLg, 'rouge-prop', 9 )).to.equal(undefined);
      expect(LG.viewOr(catLg, 'rouge-prop', 'doesnt-matter', myCat )).to.equal(undefined);
      expect(LG.viewOr(catLg, 'name', 'doesnt-matter', 9 )).to.equal(undefined);
    });
    it('should handle falsy values correctly',()=> {
      const falsey = { undef: undefined, nul: null, zero: 0, emptyStr: '' };
      const lg = LG.create( [ 'undef', 'nul', 'zero', 'emptyStr' ]);
      expect(LG.clone(lg, falsey)).to.deep.equal(R.dissoc('undef', falsey));
      expect(LG.viewOr(lg, 'u', 'undef', falsey)).to.equal('u');
    });
    it('should immutably set prop',()=>{
      const renamedCat = LG.set(catLg,'name', 'thunder', myCat);
      expect( LG.view(catLg, 'name', myCat )).to.equal('sunshine');
      expect( LG.view(catLg, 'name', renamedCat )).to.equal('thunder');
    });
    it('should immutably add props not originally on obj',()=>{
      const moodyCat = LG.set(catLg,'mood', 'happy', myCat);
      expect(myCat).to.equal(myCat);
      expect(myCat).to.deep.equal(myCat);
      expect(moodyCat).to.not.equal(myCat);
      expect(moodyCat).to.deep.equal({...myCat, mood: 'happy' });

    });
    it('should return original obj on inavlid inputs',()=> {
      const rougeCat = LG.set(catLg,'rouge-prop', 'does-not-matter', myCat);
      expect(rougeCat).to.equal(myCat);
      expect(rougeCat).to.deep.equal(myCat);
    });
  });
}

//*****************************************************************************
// Test lens groups with defaults
//*****************************************************************************

function testWithDefaults() {

  describe('With defaults', ()=>{

    const { lgProps, catLg, myCat} = getBaseTestSet();

    it('should not default existing props',()=>{
      expect( LG.viewOrDef(catLg, 'name', myCat )).to.equal('sunshine');
      expect( LG.viewOrDef(catLg, 'color', myCat )).to.equal('orange');
      expect( LG.viewOrDef(catLg, 'name', { name: '' } )).to.equal('');
    });
    it('should default non-existing props',()=>{
      expect( LG.viewOrDef(catLg, 'name', { name: null } )).to.equal('defName');
      expect( LG.viewOrDef(catLg, 'name', { name: undefined } )).to.equal('defName');
      expect( LG.viewOrDef(catLg, 'name', undefined )).to.equal(undefined);
      expect( LG.viewOrDef(catLg, 'id', myCat )).to.equal(-1);
      expect( LG.viewOrDef(catLg, 'mood', myCat )).to.equal('defMood');
      const moodyCat = LG.set(catLg,'mood', 'happy', myCat);
      expect( LG.viewOrDef(catLg, 'mood', moodyCat )).to.equal('happy');
    });
    it('should return undefined for non-defaulted props',()=>{
      const lgDefs2 = [-1, 'defName', 'defColor' ];
      const lg2 = LG.create(lgProps, lgDefs2);
      expect( LG.viewOrDef(lg2, 'name', myCat )).to.equal('sunshine');
      expect( LG.viewOrDef(lg2, 'mood', myCat )).to.equal(undefined);
    });
    it('should return undefined for missing props, misnamed props, non obj target',()=>{
      expect( LG.viewOrDef(catLg, 'rouge-prop', myCat )).to.equal(undefined);
      expect( LG.viewOrDef(catLg, 'name', 'myCat' )).to.equal(undefined);
      expect( LG.viewOrDef(catLg, 'rouge-prop', 9 )).to.equal(undefined);
    });
    it('should handle falsy values correctly',()=> {
      const falsey = { undef: undefined, nul: null, zero: 0, emptyStr: '' };
      const lg = LG.create( [ 'undef', 'nul', 'zero', 'emptyStr' ], [ undefined, null, 0, '' ]);
      expect(LG.viewOrDef(lg, 'undef', falsey)).to.equal(undefined);
      expect(LG.viewOrDef(lg, 'undef', {})).to.equal(undefined);
      expect(LG.viewOrDef(lg, 'zero', falsey)).to.equal(0);
      expect(LG.viewOrDef(lg, 'zero', {})).to.equal(0);
      expect(LG.viewOrDef(lg, 'emptyStr', falsey)).to.equal('');
      expect(LG.viewOrDef(lg, 'emptyStr', {})).to.equal('');
      // TODO: null not being handled properly, get the following tests to pass
      // expect(LG.viewOrDef(lg, 'null', falsey)).to.equal(null);
      // expect(LG.viewOrDef(lg, 'null', {})).to.equal(null);
    });

  });
}

//*****************************************************************************
// Test list based lens group operations
//*****************************************************************************

function testListOperations() {

  const {
    lgProps, lgDefs, catLg, broCatLg,
    myCat, brosCat, defCat, myCatWithDef
   } = getBaseTestSet();

  describe('List based lens operations', ()=>{
    it('should return object with specified props',()=>{
      expect(LG.viewL(catLg, ['name', 'color'], myCat)).to.deep.equal(myCat);
      expect(LG.viewL(catLg, ['name', 'color'], myCat)).to.not.equal(myCat);
      expect(LG.viewL(catLg, ['name', 'color'], {...brosCat, ...myCat})).to.deep.equal(myCat);
      expect(LG.viewL(catLg, ['color', 'mood'], myCat)).to.deep.equal({mood: undefined, color: myCat.color});
      const catViewL = LG.viewL(catLg);
      expect(catViewL(['name', 'color'], {...brosCat, ...myCat})).to.deep.equal(myCat);
      const catViewNameColor = LG.viewL(catLg, ['name', 'color']);
      expect(catViewNameColor({...brosCat, ...myCat})).to.deep.equal(myCat);

    });
    it('should return object with specified props or fallback',()=>{
      expect(LG.viewOrL(catLg, ['fb-id', 'fb-color' ], ['id', 'color'], brosCat))
        .to.deep.equal({id: brosCat.id, color: 'fb-color'});
      const catViewMoodColorNameOrFb = LG.viewOrL(catLg, ['fb-mood', 'fb-color', 'fb-name' ], ['mood', 'color', 'name']);
      const fb = {mood: 'fb-mood', color: 'fb-color', name: 'fb-name'};
      expect(catViewMoodColorNameOrFb(myCat)).to.deep.equal({...fb, ...myCat});
      expect(catViewMoodColorNameOrFb(brosCat)).to.deep.equal({...fb, ...R.dissoc('id', brosCat)});
    });
    it('should return object with specified props or default',()=>{
      expect(LG.viewOrDefL(catLg, ['id', 'color'], myCat)).to.deep.equal({id: defCat.id, color: myCat.color});
      const viewCatOrDefL = LG.viewOrDefL(catLg);
      expect(viewCatOrDefL(lgProps,{})).to.deep.equal(LG.def(catLg));
      expect(viewCatOrDefL(lgProps,myCat)).to.deep.equal(myCatWithDef);
    });
    it('should set specified props to specified vals',()=>{
      expect(LG.setL(catLg, ['name', 'mood'], ['newName', 'newMood'], myCat))
        .to.deep.equal({...myCat, name: 'newName', mood: 'newMood'});
      expect(LG.setL(catLg, ['id', 'mood'], [brosCat.id, brosCat.mood], myCat))
        .to.deep.equal({...myCat, ...brosCat});
      expect(LG.setO(catLg, myCat, brosCat))
        .to.deep.equal({...myCat, ...brosCat});
      expect(LG.setO(catLg, { color: 'blue', mood: 'frisky', id: 99 }, myCat))
        .to.deep.equal({...myCat, color: 'blue', mood: 'frisky', id: 99});
    });
  });
}

//*****************************************************************************
// Test lens group target view
//*****************************************************************************

function testLensTargetView() {

  const {
    lgProps, lgDefs, catLg, broCatLg,
    myCat, brosCat, myFamily, familyPath
  } = getBaseTestSet();

  describe('Lens Target View', ()=>{

    it('should find itself',()=>{
      expect(LG.viewTarget(catLg, myCat)).to.equal(myCat);
      expect(LG.viewTarget(catLg, myCat)).to.deep.equal(myCat);
    });
    it('should find nested',()=>{
      expect(LG.viewTarget(broCatLg, myFamily)).to.equal(brosCat);
      expect(LG.viewTarget(broCatLg, myFamily)).to.deep.equal(brosCat);
    });
    it('should return undefined on broken paths',()=>{
      const brokenPath1 = { mySister: {hisPets : { brosCat }}};
      const brokenPath2 = { myBrother: {herPets : { brosCat }}};
      expect(LG.viewTarget(broCatLg, brokenPath1)).to.equal(undefined);
      expect(LG.viewTarget(broCatLg, brokenPath2)).to.equal(undefined);
    });
    it('should work with path specializations',()=>{
      const fakeBroCatLg = LG.appendPath(familyPath, catLg );
      expect(LG.path(fakeBroCatLg)).to.deep.equal(LG.path(broCatLg));
      expect(LG.viewTarget(fakeBroCatLg, myFamily)).to.equal(brosCat);
      expect(LG.viewTarget(fakeBroCatLg, myFamily)).to.deep.equal(brosCat);
    });
    it('should curry',()=>{
      const viewBroCat = LG.viewTarget(broCatLg);
      expect(viewBroCat(myFamily)).to.equal(brosCat);
    });
  });
}

//*****************************************************************************
// Test lens group target set
//*****************************************************************************

function testLensTargetSet() {

    const {
      lgProps, lgDefs, catLg, broCatLg,
      myCat, brosCat, myFamily, familyPath
    } = getBaseTestSet();

    const newCat = { name: "newCat", mood: "fresh", color: "white" };

    describe('Lens Target Set', ()=>{

      it('should set target and return entire object',()=>{
        const familyWithNewCat = LG.setTarget(broCatLg, newCat, myFamily );
        expect( LG.viewTarget(broCatLg, familyWithNewCat)).to.equal(newCat);
        expect( LG.viewTarget(broCatLg, familyWithNewCat)).to.deep.equal(newCat);
        expect( LG.viewTarget(broCatLg, myFamily)).to.equal(brosCat);
        expect( LG.viewTarget(broCatLg, myFamily)).to.deep.equal(brosCat);
      });

      it('Should honor immutability of original object',()=>{
        const familyWithClonedCat = LG.setTarget(broCatLg, brosCat, myFamily );
        expect(familyWithClonedCat).to.not.equal(myFamily);
        expect(familyWithClonedCat).to.deep.equal(myFamily);
        familyWithClonedCat.aDog = { name: 'fido'};
        expect(familyWithClonedCat).to.have.property('aDog');
        expect(myFamily).to.not.have.property('aDog');
      });

      it('Should return clone of object on no path',()=>{
        const ignoredTarget = {};
        const clonedCat = LG.setTarget(catLg, newCat, ignoredTarget);
        expect(clonedCat).to.not.equal(newCat);
        expect(clonedCat).to.deep.equal(newCat);
      });
      it('should handle currying',()=>{
        const makeFamilyWithNewCat = LG.setTarget(broCatLg, newCat);
        const familyWithNewCat = makeFamilyWithNewCat(myFamily);
        expect(familyWithNewCat).to.not.equal(myFamily);
        expect( LG.viewTarget(broCatLg, familyWithNewCat)).to.equal(newCat);
        expect( LG.viewTarget(broCatLg, myFamily)).to.equal(brosCat);
        expect( LG.viewTarget(broCatLg, myFamily)).to.deep.equal(brosCat);
      });
    });
  }


//*****************************************************************************
// Test paths
//*****************************************************************************

function testPaths() {

  describe('Lens groups with path', ()=>{

    const {
      lgProps, lgDefs, catLg, broCatLg,
      myCat, brosCat, myFamily
     } = getBaseTestSet();

    const brokenPath1 = { mySister: {hisPets : { brosCat }}};
    const brokenPath2 = { myBrother: {herPets : { brosCat }}};

    it('Should find deep props and deep defaults',()=>{
      expect( LG.view(broCatLg, 'id', myFamily )).to.equal(9);
      expect( LG.view(broCatLg, 'mood', myFamily )).to.equal('grumpy');
      expect( LG.viewOrDef(broCatLg, 'name', myFamily )).to.equal('defName');
      expect( LG.viewOrDef(broCatLg, 'color', myFamily )).to.equal('defColor');
    });
    it('Should detect invalid inputs',()=>{
      expect( LG.view(broCatLg, 'rouge-prop', myFamily )).to.equal(undefined);
      expect(LG.viewOr(broCatLg, 'name', 'doesnt-matter', 9 )).to.equal(undefined);
    });
    it('Should detect broken paths',()=>{
      expect( LG.view(broCatLg, 'id', brokenPath1 )).to.equal(undefined);
      expect( LG.viewOrDef(broCatLg, 'name', brokenPath1 )).to.equal('defName');
      expect( LG.viewOrDef(broCatLg, 'color', brokenPath1 )).to.equal('defColor');
    });
    it('should immutably set props',()=>{
      const familyWithColorfulCat = LG.set(broCatLg, 'color', 'purple', myFamily);
      expect(myFamily).to.equal(myFamily);
      expect(myFamily).to.deep.equal(myFamily);
      expect(familyWithColorfulCat).to.not.equal(myFamily);
      expect(familyWithColorfulCat).to.not.deep.equal(myFamily);
      expect(LG.viewTarget(broCatLg, myFamily)).to.not.equal(LG.viewTarget(broCatLg, familyWithColorfulCat));
      expect( LG.view(broCatLg, 'color', familyWithColorfulCat )).to.equal('purple');
      expect( LG.view(broCatLg, 'color', myFamily )).to.equal(undefined);

      const familyWithColorfulNamedCat = LG.set(broCatLg, 'name', 'garfield', familyWithColorfulCat);
      expect(familyWithColorfulNamedCat).to.not.equal(familyWithColorfulCat);
      expect(familyWithColorfulNamedCat).to.not.deep.equal(familyWithColorfulCat);
      expect(LG.viewTarget(broCatLg, familyWithColorfulNamedCat)).to.deep.equal({
        ...brosCat,  color: 'purple', name: 'garfield'  });
    });
    it('should return original obj on inavlid inputs',()=> {
      const rougeFamily = LG.set(broCatLg,'rouge-prop', 'does-not-matter', myFamily);
      expect(rougeFamily).to.equal(myFamily);
      expect(rougeFamily).to.deep.equal(myFamily);
    });
  });
}

//*****************************************************************************
// Test lens group currying
//*****************************************************************************

function testCurry() {
  describe('Lens group currying', ()=>{

    const {
      lgProps, lgDefs,catLg, broCatLg,
      myCat, brosCat, myFamily, defCat
     } = getBaseTestSet();

    const viewCat = LG.view(catLg);
    const viewCatName = LG.view(catLg, 'name');
    const viewCatIdOrDef = LG.viewOrDef(catLg, 'id');
    const setCat = LG.set(catLg);
    const setCatColor = LG.set(catLg, 'color');

    it('Should Curry without path',()=>{
      expect(viewCat('name', myCat)).to.equal('sunshine');
      expect(viewCatIdOrDef(myCat)).to.equal(-1);
      const renamedCat1 = setCat('name', 'billy', myCat);
      const renamedCat2 = setCat('name', 'bob', renamedCat1);
      expect(viewCat('name', renamedCat1)).to.equal('billy');
      expect(viewCatName(renamedCat2)).to.equal('bob');
      expect(viewCatName(myCat)).to.equal('sunshine');

    });

    it('Should Curry with path',()=>{
      const viewMyBrosCat = LG.viewOrDef(broCatLg);
      const viewMyBrosCatOrDef = LG.viewOrDef(broCatLg);
      const viewMyBrosCatMood = LG.viewOrDef(broCatLg, 'mood');
      const setMyBrosCatColor = LG.set(broCatLg, 'color');

      expect( viewMyBrosCat('id', myFamily)).to.equal(9);
      expect( viewMyBrosCatOrDef('mood', myFamily)).to.equal('grumpy');
      expect( viewMyBrosCatMood(myFamily)).to.equal('grumpy');
      expect( viewMyBrosCatOrDef('color', myFamily)  ).to.equal('defColor');
      const colorfulBrosCatFam = setMyBrosCatColor('pink', myFamily);
      expect(viewMyBrosCatOrDef('color', colorfulBrosCatFam)).to.equal('pink');
    });
  });
}

//*****************************************************************************
// Test Cloning
//*****************************************************************************

function testClone() {
  describe('Lens Cloning', ()=>{

    const {
      lgProps, lgDefs, catLg, broCatLg,
      myCat, brosCat, myFamily, defCat
     } = getBaseTestSet();

    it('Should clone without path or defaults',()=>{
      const clonedCat1 = LG.clone(catLg,myCat);
      expect(clonedCat1).to.not.equal(myCat);
      expect(clonedCat1).to.deep.equal(myCat);
      expect(LG.def(catLg)).to.deep.equal(defCat);
      const createDefCat = ()=>LG.def(catLg);
      expect(createDefCat()).to.deep.equal(defCat);

      const cloneCat = LG.clone(catLg);
      const clonedCat2 = cloneCat(clonedCat1);
      expect(clonedCat2).to.not.equal(myCat);
      expect(clonedCat2).to.deep.equal(myCat);
    });

    const myCatWithDefs = {...defCat, ...myCat};
    it('Should clone without path but with defaults',()=>{
      const clonedCatWithDefs = LG.cloneWithDef(catLg,myCat);
      expect(clonedCatWithDefs).to.not.equal(myCat);
      expect(clonedCatWithDefs).to.deep.equal(myCatWithDefs);

      const cloneCatWithDefs = LG.cloneWithDef(catLg);
      const clonedCatWithDefs2 = cloneCatWithDefs(myCat);
      expect(clonedCatWithDefs2).to.not.equal(myCat);
      expect(clonedCatWithDefs2).to.deep.equal(myCatWithDefs);
    });

    it('Should clone with path but without defaults',()=>{
      const clonedBrosCat = LG.clone(broCatLg,myFamily);
      expect(clonedBrosCat).to.not.equal(brosCat);
      expect(clonedBrosCat).to.deep.equal(brosCat);
      expect(clonedBrosCat).to.not.deep.equal(myCat);

      const cloneBrosCat = LG.clone(broCatLg);
      const clonedBrosCat2 = cloneBrosCat(myFamily);
      expect(clonedBrosCat2).to.not.equal(brosCat);
      expect(clonedBrosCat2).to.deep.equal(brosCat);
    });

    const brosCatWithDefs = {...defCat, ...brosCat};
    it('Should clone with path and with defaults',()=>{
      const clonedBrosCatWithDefs = LG.cloneWithDef(broCatLg,myFamily);
      expect(clonedBrosCatWithDefs).to.not.equal(brosCat);
      expect(clonedBrosCatWithDefs).to.deep.equal(brosCatWithDefs);

      const cloneBrosCatWithDefs = LG.cloneWithDef(broCatLg);
      const clonedBrosCatWithDefs2 = cloneBrosCatWithDefs(myFamily);
      expect(clonedBrosCatWithDefs2).to.not.equal(brosCat);
      expect(clonedBrosCatWithDefs2).to.deep.equal(brosCatWithDefs);
      expect(LG.def(broCatLg)).to.deep.equal(defCat);
    });
    it('Should clone with defs except excluded',()=>{
      const cloneCatWithDefExcept = LG.cloneWithDefExcept(catLg);
      const someDefs1 = cloneCatWithDefExcept(['mood'], myCat);
      expect(someDefs1).to.deep.equal({...R.dissoc('mood', defCat), ...myCat, });
      const someDefs2 = cloneCatWithDefExcept(['id'], myCat);
      expect(someDefs2).to.deep.equal({...R.dissoc('id', defCat), ...myCat, });
      const someDefs3 = cloneCatWithDefExcept(['id', 'mood'], myCat);
      expect(someDefs3).to.deep.equal(myCat);
    });
  });
}

//*****************************************************************************
// Test lens group default additionss
//*****************************************************************************

function testDefaultAdd() {

  const {
    lgProps, catLg, broCatLg,
    myCat, defCat, brosCat, myFamily, familyPath
  } = getBaseTestSet();

  describe('Default additions', ()=>{

    it('should add defaults',()=>{
      expect(LG.addDef(catLg, {})).to.deep.equal(defCat);
      const catAdds = { numPaws: 4, age: 'ageless' };
      expect(LG.addDef(catLg, {...catAdds, ...myCat}))
        .to.deep.equal({...defCat, ...catAdds, ...myCat});
      expect(LG.addDef(catLg, {...catAdds, ...brosCat}))
        .to.deep.equal({...defCat, ...catAdds, ...brosCat});
      expect(LG.addDefExcept(catLg, ['mood'], {...catAdds, ...myCat}))
        .to.deep.equal(R.dissoc('mood', {...defCat, ...catAdds, ...myCat}));
      expect(LG.addDefExcept(catLg, ['name', 'color'], catAdds))
        .to.deep.equal(R.compose(R.dissoc('name'), R.dissoc('color'))({...defCat, ...catAdds}));
      expect(LG.addDefExcept(catLg, lgProps, catAdds)).to.deep.equal(catAdds);
    });
  });
}

//*****************************************************************************
// Test lens group prop specialization
//*****************************************************************************

function testLensPropSpecialization() {
  describe('Lens group prop specialization', ()=>{

    const {
      lgProps, lgDefs, catLg, broCatLg, myCat, brosCat,
      myFamily, defCat, myCatWithDef, brosCatWithDef
     } = getBaseTestSet();

     const plusProps = ['size', 'age'];
     const plusDefs = ['defSize']; // Note, providing 1 too few defaults
     const plusCat = {...myCat, age: 99};

     const plusCatDefaultExp = {...defCat, size: 'defSize'};
     const plusCatClonedFromMyCatWithDefExp = { ...myCatWithDef, size: 'defSize'  };

     it('should add new, and retain existing lenses', ()=>{
      const plusCatLg = LG.add(plusProps, plusDefs, catLg );
      expect(LG.view(plusCatLg, 'name', myCat)).to.equal('sunshine');
      expect(LG.view(plusCatLg, 'size', myCat)).to.equal(undefined);
      expect(LG.viewOrDef(plusCatLg, 'size', myCat)).to.equal('defSize');
      expect(LG.viewOrDef(plusCatLg, 'age', myCat)).to.equal(undefined);
      expect(LG.viewOrDef(plusCatLg, 'age', plusCat)).to.equal(99);
      expect(LG.def(plusCatLg)).to.deep.equal(plusCatDefaultExp);
      const clonePlusCat = LG.clone(plusCatLg);
      const clonePlusCatWithDef = LG.cloneWithDef(plusCatLg);
      expect(clonePlusCatWithDef({})).to.deep.equal(plusCatDefaultExp);
      expect(clonePlusCatWithDef(myCat)).to.deep.equal(plusCatClonedFromMyCatWithDefExp);
      expect(clonePlusCat(plusCat)).to.deep.equal(plusCat);
     });

    it('should remove lenses', ()=>{
      const plusCatLg = LG.add(plusProps, plusDefs, catLg );
      const minusCat = R.dissoc('color',myCat);
      const minusCatDef = R.dissoc('color',defCat);
      const minusCatLg1 = LG.remove(['color'], catLg);
      const minusCatLg2 = LG.remove(['size', 'color'], plusCatLg);
      expect(LG.def(minusCatLg1)).to.deep.equal(minusCatDef);
      expect(LG.def(minusCatLg1)).to.deep.equal(LG.def(minusCatLg2));
      expect(LG.view(minusCatLg1, 'color',minusCat)).to.equal(undefined);
      expect(LG.viewOrDef(minusCatLg2, 'color',minusCat)).to.equal(undefined);
    });

    it('should add new, and retain existing lenses, with path', ()=>{
      const brosPlusCatLg = LG.add(['sex'], ['defSex'], broCatLg);
      const brosCatPlusDefExp = {...defCat, sex: 'defSex'};
      expect(LG.def(brosPlusCatLg)).to.deep.equal(brosCatPlusDefExp);
      const pl = ['1', '2', '3', '4', '5', '6'];
      const ouch = LG.remove(R.reverse(pl), LG.add(pl, [], broCatLg ));
      expect(LG.def(ouch)).to.deep.equal(defCat);
      expect(LG.cloneWithDef(ouch, myFamily)).to.deep.equal(brosCatWithDef);
    });

    it('should handle duplicates', ()=>{
      const catDupLg = LG.add(['id', 'mood'], [99], catLg ); // NOTE: Default from Mood removed
      expect(LG.viewOrDef(catDupLg, 'id', myCat)).to.equal(99);
      expect(LG.viewOrDef(catDupLg, 'mood', myCat)).to.equal(undefined);
      const newDefs = [['name', 'color', 'mood'], ['newDefName', 'newDefColor', 'newDefMood']];
      const catNewDefLg = LG.add(newDefs[0], newDefs[1], catDupLg);
      expect(LG.def(catNewDefLg)).to.deep.equal({
        id: 99, name: 'newDefName', color: 'newDefColor', mood: 'newDefMood' });
    });
    it('should handle currying', ()=>{
      const addPlusLenses = LG.add(plusProps, plusDefs);
      const plusCatLg = addPlusLenses(catLg);
      expect(LG.def(plusCatLg)).to.deep.equal(plusCatDefaultExp);
      const minusCat = R.dissoc('color',myCat);
      const minusCatDef = R.dissoc('color',defCat);
      const removeMinusLenses = LG.remove(['color']);
      const minusCatLg = removeMinusLenses(catLg);
      expect(LG.def(minusCatLg)).to.deep.equal(minusCatDef);
    });
  });
}

//*****************************************************************************
// Test lens group path specialization
//*****************************************************************************

function testLensPathSpecialization() {

  const {
    lgProps, lgDefs, catLg, broCatLg, familyPath,
    myCat, brosCat, myFamily, defCat, myCatWithDef, brosCatWithDef
   } = getBaseTestSet();

  describe('Lens group path specialization', ()=>{

    it('should append path',()=>{
      const fakeBroCatLg = familyPath.reduce((lgAcc,prop)=>LG.appendPath([prop],lgAcc), catLg);
      expect(LG.path(fakeBroCatLg)).to.deep.equal(LG.path(broCatLg));
      expect(LG.def(fakeBroCatLg)).to.deep.equal(LG.def(broCatLg));
      expect(LG.viewTarget(fakeBroCatLg, myFamily)).to.equal(brosCat);
      expect(LG.clone(fakeBroCatLg, myFamily)).to.deep.equal(brosCat);
      expect(LG.cloneWithDef(fakeBroCatLg, myFamily)).to.deep.equal(brosCatWithDef);
    });

    it('should prepend path',()=>{
      const fakeBroCatLg = R.reverse(familyPath).reduce((lgAcc,prop)=>LG.prependPath([prop],lgAcc), catLg);
      expect(LG.path(fakeBroCatLg)).to.deep.equal(LG.path(broCatLg));
      expect(LG.def(fakeBroCatLg)).to.deep.equal(LG.def(broCatLg));
      expect(LG.viewTarget(fakeBroCatLg, myFamily)).to.equal(brosCat);
      expect(LG.clone(fakeBroCatLg, myFamily)).to.deep.equal(brosCat);
      expect(LG.cloneWithDef(fakeBroCatLg, myFamily)).to.deep.equal(brosCatWithDef);
    });

    it('should replace path',()=>{
      const fakeCatLg = LG.replacePath([],broCatLg);
      expect(LG.cloneWithDef(fakeCatLg, myCat)).to.deep.equal(myCatWithDef);
      const fakeBroCatLg = LG.replacePath(familyPath,fakeCatLg);
      expect(LG.cloneWithDef(fakeBroCatLg, myFamily)).to.deep.equal(brosCatWithDef);
    });

    it('should handle currying', ()=>{
      const appendFamilyPath = LG.appendPath(familyPath);
      const fakeBroCatAppendLg = appendFamilyPath(catLg);
      expect(LG.def(fakeBroCatAppendLg)).to.deep.equal(LG.def(broCatLg));
      const prependFamilyPath = LG.appendPath(familyPath);
      const fakeBroCatPrependLg = appendFamilyPath(catLg);
      expect(LG.def(fakeBroCatPrependLg)).to.deep.equal(LG.def(broCatLg));
      const removePath = LG.replacePath([]);
      const fakeCatLg = removePath(broCatLg);
      expect(LG.cloneWithDef(fakeCatLg, myCat)).to.deep.equal(myCatWithDef);
    });
  });
}

//*****************************************************************************
// TBD
//*****************************************************************************

function testMutability() {

  describe('Lens group mutability', ()=>{

    const {
      lgProps, lgDefs, catLg, broCatLg, familyPath,
      myCat, brosCat, myFamily, defCat, myCatWithDef, brosCatWithDef
     } = getBaseTestSet();

     it('should clone objects immutably',()=>{
      const clonedCat = LG.clone(catLg,myCat);
      expect(clonedCat).to.not.equal(myCat);
      expect(clonedCat).to.deep.equal(myCat);
      clonedCat.newProp = 'newProp';
      expect(clonedCat).to.not.deep.equal(myCat);
    });

    it('should clone arrays immutably',()=>{
      const arr = ['a1', 'a2'];
      const orig = { arr };
      const lga = LG.create(['arr']);
      const viewArr = LG.view(lga, 'arr');
      const setArr = LG.set(lga, 'arr');
      const cloneArr = LG.clone(lga);
      const clone = cloneArr(orig);
      expect(clone).to.not.equal(orig);
      expect(clone).to.deep.equal(orig);
      clone.arr.push('c1');
      expect(clone).to.not.deep.equal(orig);
      expect(orig.arr).to.deep.equal(['a1', 'a2']);
      expect(clone.arr).to.deep.equal(['a1', 'a2', 'c1']);
    });
  });
}

function testComplexTargets() {

}
