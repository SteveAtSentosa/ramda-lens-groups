import  { assert, expect } from 'chai';
import R from 'ramda';
import LGU from '../src/utils';


export default function runUtilTests() {
  describe('Lens Group Utils', ()=>{
    testGeneralUtils();
    testArrayTypes();
  });
}

function testGeneralUtils() {
  describe('General Utils', ()=> {
    it('should detect non nil array entry',()=>{
      expect(LGU.arrayEntryIsNotNil(0, [{}, 'a', 0])).to.equal(true);
      expect(LGU.arrayEntryIsNotNil(1, [{}, 'a', 0])).to.equal(true);
      expect(LGU.arrayEntryIsNotNil(2, [{}, 'a', 0])).to.equal(true);
    });
    it('should reject non array, undefined array, or undefined array entry',()=>{
      expect(LGU.arrayEntryIsNotNil(3, [{}, 'a', 0])).to.equal(false);
      expect(LGU.arrayEntryIsNotNil(undefined)).to.equal(false);
      expect(LGU.arrayEntryIsNotNil({})).to.equal(false);
      expect(LGU.arrayEntryIsNotNil(1, [{}, 'a', 0])).to.equal(true);
    });
    it('should detect full arrays, empty arrays and non arrays',()=>{
      expect(LGU.isNonEmptyArray()).to.equal(false);
      expect(LGU.isNonEmptyArray(1)).to.equal(false);
      expect(LGU.isNonEmptyArray({})).to.equal(false);
      expect(LGU.isNonEmptyArray([])).to.equal(false);
      expect(LGU.isNonEmptyArray([1])).to.equal(true);
      expect(LGU.isNonEmptyArray(['a', {}])).to.equal(true);
    });
  });
}

function testArrayTypes() {

  describe('String Arrays', ()=> {
    it('should accept all string elements', ()=>
      expect(LGU.isStringArray(['0', '1', '2', '3'])).to.equal(true));
    it('should reject non array', ()=>
      expect(LGU.isStringArray({})).to.equal(false));
    it('expect empty array to pass', ()=>
      expect(LGU.isStringArray([])).to.equal(true));
    it('should reject non string element',()=>{
      expect(LGU.isStringArray(['0', '1', 2, '3'])).to.equal(false);
      expect(LGU.isNotStringArray([null, '1', 2, '3'])).to.equal(true);
      });
    });
    describe('Object Arrays', ()=> {
      it('should accept all obj elements', ()=>
        expect(LGU.isObjArray([{},{},{},{}])).to.equal(true));
      it('should reject non array', ()=>
        expect(LGU.isObjArray(null)).to.equal(false));
      it('expect empty array to pass', ()=>
        expect(LGU.isStringArray([])).to.equal(true));
      it('should reject non obj element',()=>{
        expect(LGU.isObjArray([{}, {}, {}, '3'])).to.equal(false);
        expect(LGU.isNotObjArray([{}, undefined, {}, {} ])).to.equal(true);
      });
   });

   describe('Arrays Or', ()=> {
    it('should return empty array',()=>{
      expect(LGU.stringArrayOrEmpty([{}, {}, {}, '3'])).to.be.an('array').that.is.empty;
      expect(LGU.stringArrayOrEmpty([])).to.be.an('array').that.is.empty;
      expect(LGU.stringArrayOrEmpty(undefined)).to.be.an('array').that.is.empty;
      expect(LGU.stringArrayOrEmpty(null)).to.be.an('array').that.is.empty;
      expect(LGU.stringArrayOrEmpty(99)).to.be.an('array').that.is.empty;
      expect(LGU.stringArrayOrEmpty('abc')).to.be.an('array').that.is.empty;
    });
    it('should return the original',()=>{
      const sa1 = ['a', 'b', 'c'];
      const sa2 = ['d'];
      expect(LGU.stringArrayOrEmpty(sa1)).to.equal(sa1);
      expect(LGU.stringArrayOrEmpty(sa2)).to.equal(sa2);
    });
   });

}
