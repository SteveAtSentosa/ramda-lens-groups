import { type, equals, pipe, curry } from 'ramda'

export const isStr = pipe(type, equals('String'))
isStr.desc = 'string'

export const isArr = pipe(type, equals('Array'))
isArr.desc = 'array'

export const isInstanceOf = curry((Class, toCheck) => toCheck instanceof Class)
isInstanceOf.desc = 'class instance'

