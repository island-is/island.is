import { FormValue } from '@island.is/application/types'
import { isFatalAccident } from './isFatalAccident'
import { NO, YES } from '../constants'

describe('isFatalAccident', () => {
  const fatal: FormValue = {
    wasTheAccidentFatal: YES,
  }

  const notFatal: FormValue = {
    wasTheAccidentFatal: NO,
  }

  it('should return true for a fatal accident', () => {
    expect(isFatalAccident(fatal)).toEqual(true)
  })
  it('should return false for a non fatal accident', () => {
    expect(isFatalAccident(notFatal)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isFatalAccident({})).toEqual(false)
  })
})
