import { FormValue } from '@island.is/application/types'
import { WhoIsTheNotificationForEnum } from '../types'

import { 
  isInjuredAndRepresentativeOfCompanyOrInstitute, 
  isRepresentativeOfCompanyOrInstitute 
} from './isRepresentativeOfCompanyOrInstitue'
import { NO, YES } from '../constants'

const emptyObject = {}

describe('isRepresentativeOfCompanyOrInstitue', () => {
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
})

describe('isInjuredAndRepresentativeOfCompanyOrInstitute', () => {
  const representative: FormValue = {
    isRepresentativeOfCompanyOrInstitue: YES
  }

  const notRepresentative: FormValue = {
    isRepresentativeOfCompanyOrInstitue: NO
  }

  it('should return true for someone that is a representative of the company or institue', () => {
    expect(isInjuredAndRepresentativeOfCompanyOrInstitute(representative)).toEqual(true)
  })

  it('should return false for someone that isnt a representative of the company or institue', () => {
    expect(isInjuredAndRepresentativeOfCompanyOrInstitute(notRepresentative)).toEqual(
      false,
    )
  })

  it('should return false for empty object', () => {
    expect(isRepresentativeOfCompanyOrInstitute(emptyObject)).toEqual(false)
  })

  it('should return false for garbage string', () => {
    expect(isRepresentativeOfCompanyOrInstitute({isRepresentativeOfCompanyOrInstitue: 'garbage'})).toEqual(false)
  })
})