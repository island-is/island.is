import { FormValue } from '@island.is/application/core'
import {
  GeneralWorkplaceAccidentLocationEnum,
  StudiesAccidentLocationEnum,
} from '../types'
import { hideLocationAndPurpose } from './hideLocationAndPurpose'
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
