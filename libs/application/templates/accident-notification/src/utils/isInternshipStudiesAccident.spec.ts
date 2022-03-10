import { FormValue } from '@island.is/application/core'
import { StudiesAccidentTypeEnum } from '../types'
import { isInternshipStudiesAccident } from './isInternshipStudiesAccident'
describe('isInternshipStudiesAccident', () => {
  const studiesAccidentType: FormValue = {
    studiesAccident: { type: StudiesAccidentTypeEnum.INTERNSHIP },
  }

  const someOtherAccidentType: FormValue = {
    studiesAccident: { type: StudiesAccidentTypeEnum.APPRENTICESHIP },
  }

  const emptyObject = {}

  it('should return true for studies accidents', () => {
    expect(isInternshipStudiesAccident(studiesAccidentType)).toEqual(true)
  })
  it('should return false for accidents other than studies', () => {
    expect(isInternshipStudiesAccident(someOtherAccidentType)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isInternshipStudiesAccident(emptyObject)).toEqual(false)
  })
})
