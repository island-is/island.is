import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum, WorkAccidentTypeEnum } from '../types'
import { isGeneralWorkplaceAccident } from './isGeneralWorkplaceAccident'
describe('isGeneralWorkplaceAccident', () => {
  const generalWorkplaceAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for general workplace accidents', () => {
    expect(isGeneralWorkplaceAccident(generalWorkplaceAccident)).toEqual(true)
  })
  it('should return false for workplace accidents other than general', () => {
    expect(isGeneralWorkplaceAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isGeneralWorkplaceAccident(emptyObject)).toEqual(false)
  })
})
