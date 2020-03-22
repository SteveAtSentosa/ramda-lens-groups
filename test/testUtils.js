import  { assert, expect } from 'chai'
import R from 'ramda'
import LGU from '../src/utils'


export default function runUtilTests() {
  describe('Lens Group Utils', () => {
    testGeneralUtils()
    // testArrayTypes()
  })
}

function testGeneralUtils() {
  describe('General Utils', () => {
    // it('should detect non nil array entry', () => {
    //   expect(LGU.arrayEntryIsNotNil(0, [{}, 'a', 0])).to.equal(true)
    //   expect(LGU.arrayEntryIsNil(0, [{}, 'a', 0])).to.equal(false)
    //   expect(LGU.arrayEntryIsNotUndef(0, [{}, 'a', 0])).to.equal(true)
    //   expect(LGU.arrayEntryIsUndef(0, [{}, 'a', 0])).to.equal(false)

    //   expect(LGU.arrayEntryIsNotNil(1, [{}, 'a', 0])).to.equal(true)
    //   expect(LGU.arrayEntryIsNil(1, [{}, 'a', 0])).to.equal(false)
    //   expect(LGU.arrayEntryIsNotUndef(1, [{}, 'a', 0])).to.equal(true)
    //   expect(LGU.arrayEntryIsUndef(1, [{}, 'a', 0])).to.equal(false)

    //   expect(LGU.arrayEntryIsNotNil(2, [{}, 'a', 0])).to.equal(true)
    //   expect(LGU.arrayEntryIsNil(2, [{}, 'a', 0])).to.equal(false)
    //   expect(LGU.arrayEntryIsNotUndef(2, [{}, 'a', 0])).to.equal(true)
    //   expect(LGU.arrayEntryIsUndef(2, [{}, 'a', 0])).to.equal(false)

    //   expect(LGU.arrayEntryIsNotNil(2, [{}, 'a', null])).to.equal(false)
    //   expect(LGU.arrayEntryIsNil(2, [{}, 'a', null])).to.equal(true)
    //   expect(LGU.arrayEntryIsNotUndef(2, [{}, 'a', null])).to.equal(true)
    //   expect(LGU.arrayEntryIsUndef(2, [{}, 'a', null])).to.equal(false)

    //   expect(LGU.arrayEntryIsNotNil(0, [undefined])).to.equal(false)
    //   expect(LGU.arrayEntryIsNil(0, [undefined])).to.equal(true)
    //   expect(LGU.arrayEntryIsNotUndef(0, [undefined])).to.equal(false)
    //   expect(LGU.arrayEntryIsUndef(0, [undefined])).to.equal(true)

    //   expect(LGU.arrayEntryOrUndef(0, [undefined])).to.equal(undefined)
    //   expect(LGU.arrayEntryOrUndef(1, [0, null])).to.equal(null)
    //   expect(LGU.arrayEntryOrUndef(1, [{}, undefined, 0])).to.equal(undefined)
    //   expect(LGU.arrayEntryOrUndef(0, [{}, 'a', 0])).to.deep.equal({})
    //   expect(LGU.arrayEntryOrUndef(1, [{}, 'a', 0])).to.equal('a')
    //   expect(LGU.arrayEntryOrUndef(2, [{}, 'a', 0])).to.equal(0)
    //   expect(LGU.arrayEntryOrUndef(3, [{}, 'a', 0])).to.equal(undefined)

    //   expect(LGU.arrayEntryOrUndef(1, [0])).to.equal(undefined)
    //   expect(LGU.arrayEntryOrUndef(1, {})).to.equal(undefined)
    // })
    // it('should reject non array, undefined array, or undefined array entry', () => {
    //   expect(LGU.arrayEntryIsNotNil(3, [{}, 'a', 0])).to.equal(false)
    //   expect(LGU.arrayEntryIsNil(3, [{}, 'a', 0])).to.equal(true)
    //   expect(LGU.arrayEntryIsNotUndef(3, [{}, 'a', 0])).to.equal(false)
    //   expect(LGU.arrayEntryIsUndef(3, [{}, 'a', 0])).to.equal(true)

    //   expect(LGU.arrayEntryIsNotNil(undefined)).to.equal(false)
    //   expect(LGU.arrayEntryIsNil(undefined)).to.equal(true)
    //   expect(LGU.arrayEntryIsNotUndef(undefined)).to.equal(false)
    //   expect(LGU.arrayEntryIsUndef(undefined)).to.equal(true)

    //   expect(LGU.arrayEntryIsNotNil({})).to.equal(false)
    //   expect(LGU.arrayEntryIsNil({})).to.equal(true)
    //   expect(LGU.arrayEntryIsNotUndef({})).to.equal(false)
    //   expect(LGU.arrayEntryIsUndef({})).to.equal(true)

    //   expect(LGU.arrayEntryIsNotNil(1, [{}, 'a', 0])).to.equal(true)
    //   expect(LGU.arrayEntryIsNil(1, [{}, 'a', 0])).to.equal(false)
    //   expect(LGU.arrayEntryIsNotUndef(1, [{}, 'a', 0])).to.equal(true)
    //   expect(LGU.arrayEntryIsUndef(1, [{}, 'a', 0])).to.equal(false)
    // })
    // it('should detect full arrays, empty arrays and non arrays', () => {
    //   expect(LGU.isNonEmptyArray()).to.equal(false)
    //   expect(LGU.isNonEmptyArray(1)).to.equal(false)
    //   expect(LGU.isNonEmptyArray({})).to.equal(false)
    //   expect(LGU.isNonEmptyArray([])).to.equal(false)
    //   expect(LGU.isNonEmptyArray([1])).to.equal(true)
    //   expect(LGU.isNonEmptyArray(['a', {}])).to.equal(true)
    // })

    // it('should paste props correctly', () => {
    //   const ab = { a:'a', b:'b' }
    //   const cd = { c:'c', d:'d' }
    //   expect(LGU.pasteProp('a', ab, cd)).to.deep.equal({ ...cd, a:'a' })
    //   expect(LGU.pasteProp('c', ab, cd)).to.deep.equal(cd)
    //   expect(LGU.pasteProps(['a', 'b'], ab, cd)).to.deep.equal({ ...ab, ...cd })
    //   expect(LGU.pasteProps(['a', 'c'], ab, cd)).to.deep.equal({ ...cd, a:'a' })
    // })

    // it('should determin array subsets correctly', () => {
    //   expect(LGU.arrayIsSubsetOf([], [])).to.be.true
    //   expect(LGU.arrayIsSubsetOf(['a'], [])).to.be.true
    //   expect(LGU.arrayIsSubsetOf(['a'], ['a'])).to.be.true
    //   expect(LGU.arrayIsSubsetOf(['a', 'b', 'c'], ['a'])).to.be.true
    //   expect(LGU.arrayIsSubsetOf(['c', 'b', 'a'], ['a', 'b', 'c'])).to.be.true
    //   expect(LGU.arrayIsSubsetOf(['c', 'b', 'a'], ['z', 'b', 'c'])).to.be.false
    //   expect(LGU.arrayIsSubsetOf(['a', 'b'], ['a', 'b', 'c'])).to.be.false
    //   expect(LGU.arrayIsNotSubsetOf([], [])).to.be.false
    //   expect(LGU.arrayIsNotSubsetOf(['a'], [])).to.be.false
    //   expect(LGU.arrayIsNotSubsetOf(['a'], ['a'])).to.be.false
    //   expect(LGU.arrayIsNotSubsetOf(['a', 'b', 'c'], ['a'])).to.be.false
    //   expect(LGU.arrayIsNotSubsetOf(['c', 'b', 'a'], ['a', 'b', 'c'])).to.be.false
    //   expect(LGU.arrayIsNotSubsetOf(['c', 'b', 'a'], ['z', 'b', 'c'])).to.be.true
    //   expect(LGU.arrayIsNotSubsetOf(['a', 'b'], ['a', 'b', 'c'])).to.be.true
    // })
    it('should property presense detection properly', () => {
      const obj = { a: 'a', b: 'b', c: 'c' }
      expect(LGU.hasAny(['a', 'b'], obj)).to.be.true
      expect(LGU.hasAny(['z'], obj)).to.be.false
      expect(LGU.hasAll(['a'], obj)).to.be.true
      expect(LGU.hasAll(['a', 'b', 'c'], obj)).to.be.true
      expect(LGU.hasAll(['z'], obj)).to.be.false
      expect(LGU.hasAll(['a', 'b', 'c', 'z'], obj)).to.be.false
      expect(LGU.doesNotHaveAll(['a', 'b', 'c'], obj)).to.be.false
      expect(LGU.doesNotHaveAll(['z'], obj)).to.be.true
      expect(LGU.doesNotHaveAll(['a', 'b', 'c', 'z'], obj)).to.be.true
    })
  })
}

function testArrayTypes() {

  describe('String Arrays', () => {
    it('should accept all string elements', () =>
      expect(LGU.isStringArray(['0', '1', '2', '3'])).to.equal(true))
    it('should reject non array', () =>
      expect(LGU.isStringArray({})).to.equal(false))
    it('expect empty array to pass', () =>
      expect(LGU.isStringArray([])).to.equal(true))
    it('should reject non string element', () => {
      expect(LGU.isStringArray(['0', '1', 2, '3'])).to.equal(false)
      expect(LGU.isNotStringArray([null, '1', 2, '3'])).to.equal(true)
    })
  })
  describe('Object Arrays', () => {
    it('should accept all obj elements', () =>
      expect(LGU.isObjArray([{}, {}, {}, {}])).to.equal(true))
    it('should reject non array', () =>
      expect(LGU.isObjArray(null)).to.equal(false))
    it('expect empty array to pass', () =>
      expect(LGU.isStringArray([])).to.equal(true))
    it('should reject non obj element', () => {
      expect(LGU.isObjArray([{}, {}, {}, '3'])).to.equal(false)
      expect(LGU.isNotObjArray([{}, undefined, {}, {}])).to.equal(true)
    })
  })

  describe('Bool Arrays', () => {
    it('should accept all bool elements', () =>
      expect(LGU.isBoolArray([true, false, false, true])).to.equal(true))
    it('should reject non array', () =>
      expect(LGU.isBoolArray({})).to.equal(false))
    it('expect empty array to pass', () =>
      expect(LGU.isBoolArray([])).to.equal(true))
    it('should reject non bool element', () => {
      expect(LGU.isBoolArray([{}, true, false, '3'])).to.equal(false)
      expect(LGU.isNotBoolArray([false, true, 10])).to.equal(true)
    })
  })

  describe('Fn Arrays', () => {
    it('should accept all fn elements', () =>
      expect(LGU.isFnArray([LGU.isObjArray, () => null, R.equals])).to.equal(true))
    it('should reject non array', () =>
      expect(LGU.isFnArray({})).to.equal(false))
    it('expect empty array to pass', () =>
      expect(LGU.isFnArray([])).to.equal(true))
    it('should reject non obj element', () => {
      expect(LGU.isFnArray([() => null, [], () => null])).to.equal(false)
      expect(LGU.isNotFnArray([false, R.prop, 10])).to.equal(true)
    })
  })


  describe('Arrays of type and length', () => {
    it('should handle string arrays of length propertly', () => {
      expect(LGU.isStringArrayOfLength(3, ['a', 'b', 'c'])).to.equal(true)
      expect(LGU.isStringArrayOfLength(2, ['a', 'b', 'c'])).to.equal(false)
      expect(LGU.isStringArrayOfLength(2, [1, 2])).to.equal(false)
      expect(LGU.isStringArrayOfLength(1, {})).to.equal(false)
      expect(LGU.isNotStringArrayOfLength(3, ['a', 'b'])).to.equal(true)
      expect(LGU.isNotStringArrayOfLength(3, ['a', 'b', 'c'])).to.equal(false)
      expect(LGU.isNotStringArrayOfLength(1, [1])).to.equal(true)
      expect(LGU.isNotStringArrayOfLength(1, 'a')).to.equal(true)
    })
    it('should handle bool arrays of length propertly', () => {
      expect(LGU.isBoolArrayOfLength(4, [true, false, true, false])).to.equal(true)
      expect(LGU.isBoolArrayOfLength(5, [true, false, true, false])).to.equal(false)
      expect(LGU.isBoolArrayOfLength(2, [1, 2])).to.equal(false)
      expect(LGU.isBoolArrayOfLength(1, 'true')).to.equal(false)
      expect(LGU.isNotBoolArrayOfLength(3, [true, false])).to.equal(true)
      expect(LGU.isNotBoolArrayOfLength(2, [true, false])).to.equal(false)
      expect(LGU.isNotBoolArrayOfLength(1, [1])).to.equal(true)
    })
    it('should handle fxn arrays of length propertly', () => {
      expect(LGU.isFnArrayOfLength(2, [() => null, R.prop])).to.equal(true)
      expect(LGU.isFnArrayOfLength(1, [() => null, R.prop])).to.equal(false)
      expect(LGU.isFnArrayOfLength(2, [1, R.prop])).to.equal(false)
      expect(LGU.isNotFnrrayOfLength(3, [R.equals, R.length, () => null])).to.equal(false)
      expect(LGU.isNotFnrrayOfLength(3, [R.equals, [], () => null])).to.equal(true)
      expect(LGU.isNotFnrrayOfLength(2, [R.equals, R.length, () => null])).to.equal(true)
    })
  })

  describe('Arrays Or', () => {
    it('should return empty array', () => {
      expect(LGU.stringArrayOrEmpty([{}, {}, {}, '3'])).to.be.an('array').that.is.empty
      expect(LGU.stringArrayOrEmpty([])).to.be.an('array').that.is.empty
      expect(LGU.stringArrayOrEmpty(undefined)).to.be.an('array').that.is.empty
      expect(LGU.stringArrayOrEmpty(null)).to.be.an('array').that.is.empty
      expect(LGU.stringArrayOrEmpty(99)).to.be.an('array').that.is.empty
      expect(LGU.stringArrayOrEmpty('abc')).to.be.an('array').that.is.empty
    })
    it('should return the original', () => {
      const sa1 = ['a', 'b', 'c']
      const sa2 = ['d']
      expect(LGU.stringArrayOrEmpty(sa1)).to.equal(sa1)
      expect(LGU.stringArrayOrEmpty(sa2)).to.equal(sa2)
    })
  })

}
