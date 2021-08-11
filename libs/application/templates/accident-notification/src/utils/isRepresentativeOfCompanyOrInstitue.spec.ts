import { FormValue } from '@island.is/application/core'
import { YES } from '../constants'
import { isRepresentativeOfCompanyOrInstitute } from './isRepresentativeOfCompanyOrInstitue'
describe('isRepresentativeOfCompanyOrInstitue', () => {
  const representative: FormValue = {
    isRepresentativeOfCompanyOrInstitue: [YES],
  }

  const notRepresentative: FormValue = {
    isRepresentativeOfCompanyOrInstitue: [],
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
