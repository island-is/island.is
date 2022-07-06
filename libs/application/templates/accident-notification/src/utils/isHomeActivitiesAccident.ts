import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { AccidentTypeEnum } from '../types'

export const isHomeActivitiesAccident = (formValue: FormValue) => {
  const workAccidentType = getValueViaPath(
    formValue,
    'accidentType.radioButton',
  ) as AccidentTypeEnum
  return workAccidentType === AccidentTypeEnum.HOMEACTIVITIES
}
