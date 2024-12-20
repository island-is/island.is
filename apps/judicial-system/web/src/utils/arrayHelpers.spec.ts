import { isEmptyArray, isNonEmptyArray, isPresentArray } from './arrayHelpers'

describe('arrayHelpers', () => {
  describe('isPresentArray', () => {
    const testCases = [
      { input: undefined, expected: false },
      { input: null, expected: false },
      { input: [], expected: true },
      { input: [1], expected: true },
    ]
    testCases.forEach(({ input, expected }) => {
      it(`should return ${expected} for input ${input}`, () => {
        expect(isPresentArray(input)).toBe(expected)
      })
    })
  })

  describe('isEmptyArray', () => {
    const testCases = [
      { input: undefined, expected: false },
      { input: null, expected: false },
      { input: [], expected: true },
      { input: [1], expected: false },
    ]
    testCases.forEach(({ input, expected }) => {
      it(`should return ${expected} for input ${input}`, () => {
        expect(isEmptyArray(input)).toBe(expected)
      })
    })
  })

  describe('isNonEmptyArray', () => {
    const testCases = [
      { input: undefined, expected: false },
      { input: null, expected: false },
      { input: [], expected: false },
      { input: [1], expected: true },
    ]
    testCases.forEach(({ input, expected }) => {
      it(`should return ${expected} for input ${input}`, () => {
        expect(isNonEmptyArray(input)).toBe(expected)
      })
    })
  })
})
