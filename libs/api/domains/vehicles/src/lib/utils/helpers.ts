import isNumber from 'lodash/isNumber'
import isEmpty from 'lodash/isEmpty'
import isNaN from 'lodash/isNaN'
import {
  MileageReadingDto,
  PostMileageReadingModel,
} from '@island.is/clients/vehicles-mileage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isNumeric = (value: any) => {
  return isNumber(value) || (!isEmpty(value) && !isNaN(parseFloat(value)))
}

export const toMileageString = (mileage: number | string | undefined) => {
  if (isNumeric(mileage)) {
    return String(mileage)
  }
  return undefined
}

export const mileageDetailConstructor = (
  detail: MileageReadingDto | PostMileageReadingModel,
) => {
  return {
    ...detail,
    mileageNumber: detail.mileage,
    mileage: toMileageString(detail.mileage),
  }
}
