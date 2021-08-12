import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum } from '../types'

export const isRescueWorkAccident = (formValue: FormValue) => {
  const accidentType = (formValue as {
    accidentType: { radioButton: AccidentTypeEnum }
  })?.accidentType?.radioButton
  return accidentType === AccidentTypeEnum.RESCUEWORK
}
