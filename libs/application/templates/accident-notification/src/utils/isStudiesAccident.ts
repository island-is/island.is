import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum } from '../types'

export const isStudiesAccident = (formValue: FormValue) => {
  const accidentType = (formValue as {
    accidentType: { radioButton: AccidentTypeEnum }
  })?.accidentType?.radioButton
  return accidentType === AccidentTypeEnum.STUDIES
}
