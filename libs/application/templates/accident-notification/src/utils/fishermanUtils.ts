import { FormValue, getValueViaPath } from '@island.is/application/core'
import {
  FishermanWorkplaceAccidentLocationEnum,
  WorkAccidentTypeEnum,
} from '../types'
import { isWorkAccident } from './isWorkAccident'

// As this is a second question the user is asked there is a case where he could go back and select home activities and keep the workaccident type.
// Therefore we need to check also whether this is a work accident
export const isFishermanAccident = (formValue: FormValue) => {
  const workAccidentType = getValueViaPath(
    formValue,
    'workAccident.type',
  ) as WorkAccidentTypeEnum
  return (
    workAccidentType === WorkAccidentTypeEnum.FISHERMAN &&
    isWorkAccident(formValue)
  )
}

// As this is a third question the user is asked there is a case where he could go back
// and select home activities and keep the workaccident type or go back and change where the
// accident happened.
// Therefore we need to check ifFishermanAccident function again
export const isAboardShip = (formValue: FormValue) => {
  const fishermanWorkplaceAccidentLocationAnswer = getValueViaPath(
    formValue,
    'accidentLocation.asnwer',
  ) as FishermanWorkplaceAccidentLocationEnum
  return (
    isFishermanAccident(formValue) &&
    fishermanWorkplaceAccidentLocationAnswer ===
      FishermanWorkplaceAccidentLocationEnum.ONTHESHIP
  )
}
