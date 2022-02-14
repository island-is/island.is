import { FormValue, getValueViaPath } from '@island.is/application/core'
import { AccidentTypeEnum } from '../types'

export const isStudiesAccident = (formValue: FormValue) => {
  const accidentType = getValueViaPath(
    formValue,
    'accidentType.radioButton',
  ) as AccidentTypeEnum
  return accidentType === AccidentTypeEnum.STUDIES
}
