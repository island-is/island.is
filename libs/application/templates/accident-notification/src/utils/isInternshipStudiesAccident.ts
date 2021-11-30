import { FormValue } from '@island.is/application/core'
import { StudiesAccidentTypeEnum } from '../types'

export const isInternshipStudiesAccident = (formValue: FormValue) => {
  const studiesAccidentType = (formValue as {
    studiesAccident: { type: StudiesAccidentTypeEnum }
  })?.studiesAccident?.type
  return studiesAccidentType === StudiesAccidentTypeEnum.INTERNSHIP
}
