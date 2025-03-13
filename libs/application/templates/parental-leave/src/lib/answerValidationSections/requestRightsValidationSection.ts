import { Application } from '@island.is/application/types'
import { ParentalRelations } from '../../constants'
import { RequestRightsObj } from '../../types'
import { errorMessages } from '../messages'
import {
  getApplicationAnswers,
  getMaxMultipleBirthsDays,
  getSelectedChild,
} from '../parentalLeaveUtils'
import { buildError } from './utils'
import { YES } from '@island.is/application/core'

export const requestRightsValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const requestRightsObj = newAnswer as RequestRightsObj

  const { multipleBirthsRequestDays, hasMultipleBirths } =
    getApplicationAnswers(application.answers)
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (
    requestRightsObj.isRequestingRights === YES &&
    hasMultipleBirths === YES &&
    multipleBirthsRequestDays * 1 !==
      getMaxMultipleBirthsDays(application.answers) &&
    selectedChild?.parentalRelation === ParentalRelations.primary
  ) {
    return buildError(errorMessages.notAllowedToRequestRights, 'transferRights')
  }

  return undefined
}
