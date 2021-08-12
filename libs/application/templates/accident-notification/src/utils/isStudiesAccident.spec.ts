import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum } from '../types'
import { isStudiesAccident } from './isStudiesAccident'
describe('isStudiesAccident', () => {
  const studiesAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.STUDIES },
  }

  const someOtherAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const emptyObject = {}

  it('should return true for studies accidents', () => {
    expect(isStudiesAccident(studiesAccident)).toEqual(true)
  })
  it('should return false for accidents other than studies', () => {
    expect(isStudiesAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isStudiesAccident(emptyObject)).toEqual(false)
  })
})
