import { FormValue } from '@island.is/application/core'
import {
  GeneralWorkplaceAccidentLocationEnum,
  StudiesAccidentLocationEnum,
} from '../types'

export const hideLocationAndPurpose = (formValue: FormValue) => {
  const answer = (formValue as {
    accidentLocation: {
      answer: GeneralWorkplaceAccidentLocationEnum & StudiesAccidentLocationEnum
    }
  })?.accidentLocation?.answer
  return (
    answer === GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE ||
    answer === StudiesAccidentLocationEnum.ATTHESCHOOL
  )
}
