import { FormValue } from '@island.is/application/core'
import { WorkAccidentTypeEnum } from '../types'
import { isAgricultureAccident } from './isAgricultureAccident'
describe('isAgricultureAccident', () => {
  const agricultureAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.AGRICULTURE },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for fisherman accidents', () => {
    expect(isAgricultureAccident(agricultureAccident)).toEqual(true)
  })
  it('should return true for workplace accidents other than fisherman', () => {
    expect(isAgricultureAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isAgricultureAccident(emptyObject)).toEqual(false)
  })
})
