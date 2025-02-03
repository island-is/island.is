import { Answer } from '@island.is/application/types'
import { YES, NO, hasYes, YesOrNo } from './constants'

describe('hasYes', () => {
  const stringThatIsYes: Answer = YES

  const stringThatIsNo: Answer = NO

  const objectContainsYesValue: Record<string, YesOrNo> = {
    a: NO,
    b: YES,
  }

  const objectNotContainsYesValue: Record<string, YesOrNo> = {
    a: NO,
    b: NO,
  }

  const arrayContainsYes: YesOrNo[] = [NO, YES]

  const arrayNotContainsYes: YesOrNo[] = [NO, NO]

  it('should return true for string that is yes', () => {
    expect(hasYes(stringThatIsYes)).toEqual(true)
  })

  it('should return false for string that is no', () => {
    expect(hasYes(stringThatIsNo)).toEqual(false)
  })

  it('should return false for empty string', () => {
    expect(hasYes('')).toEqual(false)
  })

  it('should return false for string with anything other than yes', () => {
    expect(hasYes('abc123')).toEqual(false)
  })

  it('should return false for string that has yes somewhere in the string', () => {
    expect(hasYes('abcyes123')).toEqual(false)
  })

  it('should return true for object that has any value that contains yes', () => {
    expect(hasYes(objectContainsYesValue)).toEqual(true)
  })

  it('should return false for object that has no value that contains yes', () => {
    expect(hasYes(objectNotContainsYesValue)).toEqual(false)
  })

  it('should return true for array containing yes', () => {
    expect(hasYes(arrayContainsYes)).toEqual(true)
  })

  it('should return false for array containing yes', () => {
    expect(hasYes(arrayNotContainsYes)).toEqual(false)
  })

  it('should return false for empty object', () => {
    expect(hasYes({})).toEqual(false)
  })

  it('should return false for empty array', () => {
    expect(hasYes([])).toEqual(false)
  })
})
