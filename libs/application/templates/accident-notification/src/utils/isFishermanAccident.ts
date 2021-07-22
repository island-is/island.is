import { FormValue } from '@island.is/application/core'
import { WorkAccidentTypeEnum } from '../types'

export const isFishermanAccident = (formValue: FormValue) => {
  const workAccidentType = (formValue as {
    workAccident: { type: WorkAccidentTypeEnum }
  })?.workAccident?.type
  return workAccidentType === WorkAccidentTypeEnum.FISHERMAN
}
