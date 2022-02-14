import { FormValue, getValueViaPath } from '@island.is/application/core'
import { AccidentTypeEnum } from '../types'

export const isHomeActivitiesAccident = (formValue: FormValue) => {
  const workAccidentType = getValueViaPath(
    formValue,
    'accidentType.radioButton',
  ) as AccidentTypeEnum
  return workAccidentType === AccidentTypeEnum.HOMEACTIVITIES
}
