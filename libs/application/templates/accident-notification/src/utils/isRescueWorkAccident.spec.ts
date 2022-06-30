import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum } from '../types'
import { isRescueWorkAccident } from './isRescueWorkAccident'
describe('isRescueWorkAccident', () => {
  const rescueWorkAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.RESCUEWORK },
  }

  const someOtherAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const emptyObject = {}

  it('should return true for rescue work accidents', () => {
    expect(isRescueWorkAccident(rescueWorkAccident)).toEqual(true)
  })
  it('should return false for accidents other than rescue work', () => {
    expect(isRescueWorkAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isRescueWorkAccident(emptyObject)).toEqual(false)
  })
})
