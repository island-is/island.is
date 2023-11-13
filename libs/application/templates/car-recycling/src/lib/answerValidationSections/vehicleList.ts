import { Application } from '@island.is/application/types'

//import { validatorErrorMessages } from '../messages'

import { getApplicationAnswers } from '../carRecyclingUtils'

import { AnswerValidationConstants } from '../../shared/constants'
import { buildError } from './utils'

export const vehiclesList = (newAnswer: unknown, application: Application) => {
  const { VEHICLES_LIST } = AnswerValidationConstants
  const { vehiclesList } = getApplicationAnswers(application.answers)

  console.log('vehicle - validators', vehiclesList)

  //if (!vehiclesList || (vehiclesList && vehiclesList.length === 0)) {
  return buildError(
    'validatorErrorMessages.periodStartDateNeeded',
    `${VEHICLES_LIST}`,
  )
  // }

  return undefined
}
