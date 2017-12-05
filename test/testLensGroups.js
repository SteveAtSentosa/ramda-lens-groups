import  { assert, expect } from 'chai';
import R from 'ramda';
import RA from 'ramda-adjunct';
import LG from '../src/lensGroups';

export default function runLensGroupTests() {

  describe('Test Lens Groups', ()=>{
    testInvalidCreate();
    testWithoutDefaults();
    testWithDefaults();
    testLensTarget();
    testPaths();
    testCurry();
    testClone();
    testLensSpecializtion();
  });
}

//*****************************************************************************
// Base testing dataset
//*****************************************************************************

function getBaseTestSet() {
  const testSet = {
    lgProps: ['id', 'name', 'color',    'mood' ],
    lgDefs: [-1, 'defName', 'defColor', 'defMood' ],
    path: [ 'myBrother', 'hisPets', 'brosCat'],
    myCat: { name: 'sunshine', color: 'orange' },
    brosCat: { id: 9, mood: 'grumpy' },
    defCat: { id: -1, name: 'defName', color: 'defColor', mood: 'defMood' }
  };
  return {
    ...testSet,
    myFamily: { myBrother: {hisPets : { brosCat: testSet.brosCat }}},
    catLg: LG.create(testSet.lgProps, testSet.lgDefs),
    broCatLg: LG.create(testSet.lgProps, testSet.lgDefs, testSet.path),
    myCatWithDef: { ...testSet.defCat, ... testSet.myCat  },
    brosCatWithDef: { ...testSet.defCat, ... testSet.brosCat  }
  };
}

//*****************************************************************************
// Test lens creation with bad inputs
//*****************************************************************************

function testInvalidCreate() {
  describe('Invalid lens creation', ()=>{
    it('should log error and return undefined',()=>{
      expect(LG.create()).to.equal(undefined);
      expect(LG.create(['p'], {})).to.equal(undefined);
      expect(LG.create(['p'], ['d'], 10)).to.equal(undefined);
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
    });
    it('should default non-existing props',()=>{
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
    it('should fallback non-existing props',()=>{
      expect( LG.viewOr(catLg, 'fallback-name', 'name', myCat )).to.equal('sunshine');
      expect( LG.viewOr(catLg, 'fallback-id', 'id', myCat )).to.equal('fallback-id');
      expect( LG.viewOr(catLg, 'fallback-mood', 'mood', myCat )).to.equal('fallback-mood');
    });
    it('should return undefined for missing props, misnamed props, non obj target',()=>{
      expect( LG.viewOrDef(catLg, 'rouge-prop', myCat )).to.equal(undefined);
      expect( LG.viewOrDef(catLg, 'name', 'myCat' )).to.equal(undefined);
      expect( LG.viewOrDef(catLg, 'rouge-prop', 9 )).to.equal(undefined);
    });
  });
}

//*****************************************************************************
// Test lens creation with bad inputs
//*****************************************************************************

function testLensTarget() {
  describe('Lens targert operations', ()=>{

    const {
      lgProps, lgDefs, path, catLg, broCatLg,
      myCat, brosCat, myFamily
     } = getBaseTestSet();

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
  });
}

//*****************************************************************************
// Test paths
//*****************************************************************************

function testPaths() {

  describe('Lens groups with path', ()=>{

    const {
      lgProps, lgDefs, path, catLg, broCatLg,
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
// Test lens currying and composition
//*****************************************************************************

function testCurry() {
  describe('Lens group currying', ()=>{

    const { lgProps, catLg, lgDefs, myCat} = getBaseTestSet();

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

    const path = [ 'myBrother', 'hisPets', 'brosCat'];
    const brosCat = { id: 9, mood: 'grumpy' };
    const broCatLg = LG.create(lgProps, lgDefs, path);
    const myFamily = { myBrother: {hisPets : { brosCat }}};

    const viewMyBrosCat = LG.viewOrDef(broCatLg);
    const viewMyBrosCatOrDef = LG.viewOrDef(broCatLg);
    const viewMyBrosCatMood = LG.viewOrDef(broCatLg, 'mood');
    const setMyBrosCatColor = LG.set(broCatLg, 'color');

    it('Should Curry with path',()=>{
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
      lgProps, lgDefs, path, catLg, broCatLg,
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
  });
}


//*****************************************************************************
// Test lens group specialization
//*****************************************************************************

function testLensSpecializtion() {
  describe('Lens group mutations', ()=>{

    const {
      lgProps, lgDefs, path, catLg, broCatLg,
      myCat, brosCat, myFamily, defCat, myCatWithDef, brosCatWithDef
     } = getBaseTestSet();

     const plusProps = ['size', 'age'];
     const plusDefs = ['defSize']; // Note, providing 1 too few defaults
     const plusCat = {...myCat, age: 99};
     const lgPlus = LG.add(catLg, plusProps, plusDefs );

     it('should add new, and retain existing lenses', ()=>{

      const plusCatDefaultExp = {...defCat, size: 'defSize'};
      const plusCatClonedFromMyCatWithDefExp = { ...myCatWithDef, size: 'defSize'  };

      expect(LG.view(lgPlus, 'name', myCat)).to.equal('sunshine');
      expect(LG.view(lgPlus, 'size', myCat)).to.equal(undefined);
      expect(LG.viewOrDef(lgPlus, 'size', myCat)).to.equal('defSize');
      expect(LG.viewOrDef(lgPlus, 'age', myCat)).to.equal(undefined);
      expect(LG.viewOrDef(lgPlus, 'age', plusCat)).to.equal(99);
      expect(LG.def(lgPlus)).to.deep.equal(plusCatDefaultExp);
      const clonePlusCat = LG.clone(lgPlus);
      const clonePlusCatWithDef = LG.cloneWithDef(lgPlus);
      expect(clonePlusCatWithDef({})).to.deep.equal(plusCatDefaultExp);
      expect(clonePlusCatWithDef(myCat)).to.deep.equal(plusCatClonedFromMyCatWithDefExp);
      expect(clonePlusCat(plusCat)).to.deep.equal(plusCat);
     });

    it('should remove lenses', ()=>{
      const minusCat = R.dissoc('color',myCat);
      const minusCatDef = R.dissoc('color',defCat);
      const lgMinus1 = LG.remove(catLg, ['color']);
      const lgMinus2 = LG.remove(lgPlus, ['size', 'color']);
      expect(LG.def(lgMinus1)).to.deep.equal(minusCatDef);
      expect(LG.def(lgMinus1)).to.deep.equal(LG.def(lgMinus2));
      expect(LG.view(lgMinus1, 'color',minusCat)).to.equal(undefined);
      expect(LG.viewOrDef(lgMinus2, 'color',minusCat)).to.equal(undefined);
    });

    it('should add new, and retain existing lenses, with path', ()=>{
      const brosPlusCatLg = LG.add(broCatLg, ['sex'], ['defSex']);
      const brosCatPlusDefExp = {...defCat, sex: 'defSex'};
      expect(LG.def(brosPlusCatLg)).to.deep.equal(brosCatPlusDefExp);
      const pl = ['1', '2', '3', '4', '5', '6'];
      const ouch = LG.remove(LG.add(broCatLg, pl), R.reverse(pl));
      expect(LG.def(ouch)).to.deep.equal(defCat);
      expect(LG.cloneWithDef(ouch, myFamily)).to.deep.equal(brosCatWithDef);

      // TODO: tinker with a creating a lense that transforms my cat to bro cat
    });
  });
}

//*****************************************************************************
// TBD
//*****************************************************************************

function testComplexTargets() {

}

function testArrayMutability() {
}

