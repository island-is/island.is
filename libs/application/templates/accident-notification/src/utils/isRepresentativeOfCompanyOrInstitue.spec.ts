import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'

import { isRepresentativeOfCompanyOrInstitute } from './isRepresentativeOfCompanyOrInstitue'
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

  const emptyObject = {}

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
