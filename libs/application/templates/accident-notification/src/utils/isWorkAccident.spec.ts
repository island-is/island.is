import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum } from '../types'
import { isWorkAccident } from './isWorkAccident'
describe('isWorkAccident', () => {
  const workAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const emptyObject = {}

  it('should return true for work accidents', () => {
    expect(isWorkAccident(workAccident)).toEqual(true)
  })
  it('should return false for accidents other than work', () => {
    expect(isWorkAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isWorkAccident(emptyObject)).toEqual(false)
  })
})
