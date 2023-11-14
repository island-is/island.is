import { Application } from '@island.is/application/types'

import { AnswerValidationConstants } from '../../shared/constants'
import { buildError } from './utils'
import { VehicleMiniDto } from '@island.is/clients/vehicles'
import { errorMessages } from './../messages'

export const vehicles = (newAnswer: unknown, application: Application) => {
  const { VEHICLES } = AnswerValidationConstants
  const obj = newAnswer as {
      selectedVehicles: VehicleMiniDto[]
  }

  if (!obj || obj.selectedVehicles.length === 0) {
  return buildError(
    errorMessages.mustSelectACar,
    `${VEHICLES}`,
  )
  }

  return undefined
}
