import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { AccidentTypeEnum } from '../types'

export const isWorkAccident = (formValue: FormValue) => {
  const accidentType = getValueViaPath(
    formValue,
    'accidentType.radioButton',
  ) as AccidentTypeEnum
  return accidentType === AccidentTypeEnum.WORK
}
