import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum, WorkAccidentTypeEnum } from '../types'
import { isAgricultureAccident } from './isAgricultureAccident'
describe('isAgricultureAccident', () => {
  const agricultureAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.AGRICULTURE },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for agriculture accidents', () => {
    expect(isAgricultureAccident(agricultureAccident)).toEqual(true)
  })
  it('should return false for workplace accidents other than agriculture', () => {
    expect(isAgricultureAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isAgricultureAccident(emptyObject)).toEqual(false)
  })
})
