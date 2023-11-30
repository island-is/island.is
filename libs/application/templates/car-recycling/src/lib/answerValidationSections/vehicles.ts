import { AnswerValidationConstants } from '../../shared/constants'
import { VehicleDto } from '../types'
import { buildError } from './utils'

import { errorMessages } from './../messages'

export const vehicles = (newAnswer: unknown) => {
  const { VEHICLES } = AnswerValidationConstants
  const obj = newAnswer as {
    selectedVehicles: VehicleDto[]
  }

  if (!obj || obj.selectedVehicles.length === 0) {
    return buildError(errorMessages.mustSelectAVehicle, `${VEHICLES}`)
  }

  return undefined
}
