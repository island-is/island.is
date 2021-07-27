import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum, WorkAccidentTypeEnum } from '../types'
import { isProfessionalAthleteAccident } from './isProfessionalAthleteAccident'

describe('isProfessionalAthleteAccident', () => {
  const professionalAthleteAccidentRadio: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.SPORTS },
  }

  const professionalAthleteAccidentSecondaryWorkQuestion: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
  }

  const emptyObject = {}

  it('should return true for professional athlete accidents', () => {
    expect(
      isProfessionalAthleteAccident(professionalAthleteAccidentRadio),
    ).toEqual(true)
  })

  it('should return true for professional athlete accident when user picked work related and then sports related', () => {
    expect(
      isProfessionalAthleteAccident(
        professionalAthleteAccidentSecondaryWorkQuestion,
      ),
    ).toEqual(true)
  })

  it('should return false for workplace accidents other than professional athlete', () => {
    expect(isProfessionalAthleteAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isProfessionalAthleteAccident(emptyObject)).toEqual(false)
  })
})
