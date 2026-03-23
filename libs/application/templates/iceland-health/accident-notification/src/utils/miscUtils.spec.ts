import {
  formatPhonenumber,
  hasReceivedConfirmation,
  hideLocationAndPurpose,
  isHealthInsured,
  isInjuredAndRepresentativeOfCompanyOrInstitute,
  isPowerOfAttorney,
  isRepresentativeOfCompanyOrInstitute,
  shouldRequestReview,
} from './miscUtils'
import { FormValue } from '@island.is/application/types'
import { AccidentNotificationAnswers } from '..'
import { NO, YES } from '@island.is/application/core'
import {
  AccidentTypeEnum,
  GeneralWorkplaceAccidentLocationEnum,
  StudiesAccidentLocationEnum,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
} from './enums'

const emptyObject = {}

describe('formatPhonenumber', () => {
  it.each([
    { input: '1234567', expected: '123-4567' },
    { input: '1234567891011', expected: '123-4567891011' },
    { input: 'ABCDEF@!()', expected: 'ABC-DEF@!()' },
    { input: '123', expected: '123' },
  ])('should format phone number', ({ input, expected }) => {
    const result = formatPhonenumber(input)
    expect(result).toBe(expected)
  })
})

describe('hasReceivedConfirmation', () => {
  const confirmedJuridicial: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.JURIDICALPERSON,
    },
    accidentStatus: {
      receivedConfirmations: {
        InjuredOrRepresentativeParty: true,
      },
    },
  }

  const confirmedMe: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.ME,
    },
    accidentStatus: {
      receivedConfirmations: {
        CompanyParty: true,
      },
    },
  }

  const notConfirmed: FormValue = {
    accidentStatus: {
      receivedConfirmations: false,
    },
  }

  it.each([
    { for: 'juridical person', input: confirmedJuridicial, expected: true },
    { for: 'company', input: confirmedMe, expected: true },
    { for: 'not confirmed', input: notConfirmed, expected: false },
  ])(
    'should return $expected when confirmation is $for',
    ({ input, expected }) => {
      expect(hasReceivedConfirmation(input)).toEqual(expected)
    },
  )
})

describe('hideLocationAndPurpose', () => {
  const accidentLocationAtWorkplace: FormValue = {
    accidentLocation: {
      answer: GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE,
    },
  }

  const accidentLocationAtSchoole: FormValue = {
    accidentLocation: { answer: StudiesAccidentLocationEnum.ATTHESCHOOL },
  }

  const someOtherLocation: FormValue = {
    accidentLocation: { answer: GeneralWorkplaceAccidentLocationEnum.OTHER },
  }

  const emptyObject = {}

  it('should return true for accident location at workplace', () => {
    expect(hideLocationAndPurpose(accidentLocationAtWorkplace)).toEqual(true)
  })
  it('should return true for accident location at school', () => {
    expect(hideLocationAndPurpose(accidentLocationAtSchoole)).toEqual(true)
  })
  it('should return false for accident location elsewhere', () => {
    expect(hideLocationAndPurpose(someOtherLocation)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(hideLocationAndPurpose(emptyObject)).toEqual(false)
  })
})

describe('isHealthInsured', () => {
  const healthInsured = {
    accidentDetails: {
      isHealthInsured: 'yes',
    },
  }

  const notHealthInsured = {
    accidentDetails: {
      isHealthInsured: 'no',
    },
  }

  it('should return true when health insured is yes', () => {
    expect(isHealthInsured(healthInsured)).toEqual(true)
  })

  it('should return false when health insured is no', () => {
    expect(isHealthInsured(notHealthInsured)).toEqual(false)
  })

  it('should return true when health insured is undefined', () => {
    expect(isHealthInsured({})).toEqual(true)
  })
})

describe('isPowerOfAttorney', () => {
  const powerOfAttorneyReporter: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
  }

  const juridicialPersonReporter: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.JURIDICALPERSON,
    },
  }

  const reportingForSelf: FormValue = {
    whoIsTheNotificationFor: { answer: WhoIsTheNotificationForEnum.ME },
  }

  it('should return true for power of attorney reporter', () => {
    expect(isPowerOfAttorney(powerOfAttorneyReporter)).toEqual(true)
  })

  it('should return false for power of juridical person reporter', () => {
    expect(isPowerOfAttorney(juridicialPersonReporter)).toEqual(false)
  })

  it('should return false for reporting for yourself', () => {
    expect(isPowerOfAttorney(reportingForSelf)).toEqual(false)
  })

  it('should return false for empty object', () => {
    expect(isPowerOfAttorney(emptyObject)).toEqual(false)
  })
})

describe('isRepresentativeOfCompanyOrInstitute', () => {
  const representative: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.JURIDICALPERSON,
    },
  }

  const notRepresentative: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.ME,
    },
  }

  const emptyRepresentative: FormValue = {
    whoIsTheNotificationFor: {},
  }

  it('should return true for someone that is a representative of the company or institue', () => {
    expect(isRepresentativeOfCompanyOrInstitute(representative)).toEqual(true)
  })
  it('should return false for someone that isnt a representative of the company or institue', () => {
    expect(isRepresentativeOfCompanyOrInstitute(notRepresentative)).toEqual(
      false,
    )
  })
  it('should return false for empty object', () => {
    expect(isRepresentativeOfCompanyOrInstitute(emptyObject)).toEqual(false)
  })
  it('should return false for empty whoIsTheNotificationFor', () => {
    expect(isRepresentativeOfCompanyOrInstitute(emptyRepresentative)).toEqual(
      false,
    )
  })
})

describe('isInjuredAndRepresentativeOfCompanyOrInstitute', () => {
  const representative: FormValue = {
    isRepresentativeOfCompanyOrInstitute: YES,
  }

  const notRepresentative: FormValue = {
    isRepresentativeOfCompanyOrInstitute: NO,
  }

  it('should return true for someone that is a representative of the company or institute', () => {
    expect(
      isInjuredAndRepresentativeOfCompanyOrInstitute(representative),
    ).toEqual(true)
  })

  it('should return false for someone that isnt a representative of the company or institute', () => {
    expect(
      isInjuredAndRepresentativeOfCompanyOrInstitute(notRepresentative),
    ).toEqual(false)
  })

  it('should return false for empty object', () => {
    expect(isInjuredAndRepresentativeOfCompanyOrInstitute(emptyObject)).toEqual(
      false,
    )
  })

  it('should return false for garbage string', () => {
    expect(
      isInjuredAndRepresentativeOfCompanyOrInstitute({
        isRepresentativeOfCompanyOrInstitute: 'garbage',
      }),
    ).toEqual(false)
  })

  it('should return false for object with non string value', () => {
    expect(
      isInjuredAndRepresentativeOfCompanyOrInstitute({
        isRepresentativeOfCompanyOrInstitute: true,
      }),
    ).toEqual(false)
  })
})

describe('shouldRequestReview', () => {
  const agricultureAccident: Partial<AccidentNotificationAnswers> = {
    workAccident: { type: WorkAccidentTypeEnum.AGRICULTURE },
  }

  const accidentAtHome: Partial<AccidentNotificationAnswers> = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const normalWorkAccident: Partial<AccidentNotificationAnswers> = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
  }

  it('should return false for work accidents', () => {
    expect(shouldRequestReview(agricultureAccident)).toEqual(false)
  })
  it('should return true for general work accident', () => {
    expect(shouldRequestReview(normalWorkAccident)).toEqual(true)
  })
  it('should return false for home accident', () => {
    expect(shouldRequestReview(accidentAtHome)).toEqual(false)
  })
})
