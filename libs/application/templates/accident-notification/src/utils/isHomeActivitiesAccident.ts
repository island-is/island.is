import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum } from '../types'

export const isHomeActivitiesAccident = (formValue: FormValue) => {
  const workAccidentType = (formValue as {
    accidentType: { radioButton: AccidentTypeEnum }
  })?.accidentType?.radioButton
  return workAccidentType === AccidentTypeEnum.HOMEACTIVITIES
}
