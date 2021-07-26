import { FormValue } from '@island.is/application/core'
import { WorkAccidentTypeEnum } from '../types'
import { isWorkAccident } from './isWorkAccident'

// As this is a second question the user is asked there is a case where he could go back and select home activities and keep the workaccident type.
// Therefore we need to check also whether this is a work accident
export const isGeneralWorkplaceAccident = (formValue: FormValue) => {
  const workAccidentType = (formValue as {
    workAccident: { type: WorkAccidentTypeEnum }
  })?.workAccident?.type
  return (
    workAccidentType === WorkAccidentTypeEnum.GENERAL &&
    isWorkAccident(formValue)
  )
}
