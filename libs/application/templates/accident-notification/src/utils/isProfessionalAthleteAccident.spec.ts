import { FormValue } from '@island.is/application/core'
import { WorkAccidentTypeEnum } from '../types'
import { isProfessionalAthleteAccident } from './isProfessionalAthleteAccident'
describe('isProfessionalAthleteAccident', () => {
  const professionalAthleteAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
  }

  const emptyObject = {}

  it('should return true for professional athlete accidents', () => {
    expect(isProfessionalAthleteAccident(professionalAthleteAccident)).toEqual(
      true,
    )
  })
  it('should return true for workplace accidents other than professional athlete', () => {
    expect(isProfessionalAthleteAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isProfessionalAthleteAccident(emptyObject)).toEqual(false)
  })
})
