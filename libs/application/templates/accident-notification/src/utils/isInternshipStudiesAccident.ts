import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { StudiesAccidentTypeEnum } from '../types'

export const isInternshipStudiesAccident = (formValue: FormValue) => {
  const studiesAccidentType = getValueViaPath(
    formValue,
    'studiesAccident.type',
  ) as StudiesAccidentTypeEnum
  return studiesAccidentType === StudiesAccidentTypeEnum.INTERNSHIP
}
