import { FormValue } from '@island.is/application/core'
import { WorkAccidentTypeEnum } from '../types'

export const isAgricultureAccident = (formValue: FormValue) => {
  console.log(formValue)
  const workAccidentType = (formValue as {
    workAccident: { type: WorkAccidentTypeEnum }
  })?.workAccident?.type
  return workAccidentType === WorkAccidentTypeEnum.AGRICULTURE
}
