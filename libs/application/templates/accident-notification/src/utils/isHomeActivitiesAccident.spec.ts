import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum } from '../types'
import { isHomeActivitiesAccident } from './isHomeActivitiesAccident'
describe('isHomeActivitiesAccident', () => {
  const homeActivitiesAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const someOtherAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.RESCUEWORK },
  }

  const emptyObject = {}

  it('should return true for home activity accidents', () => {
    expect(isHomeActivitiesAccident(homeActivitiesAccident)).toEqual(true)
  })
  it('should return false for accidents other than home activity accidents', () => {
    expect(isHomeActivitiesAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isHomeActivitiesAccident(emptyObject)).toEqual(false)
  })
})
