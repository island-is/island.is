import { Application } from '@island.is/application/types'
import { GiveRightsObj } from '../../types'
import { getApplicationAnswers, getSelectedChild } from '../parentalLeaveUtils'
import { ParentalRelations, YES } from '../../constants'
import { buildError } from './utils'
import { errorMessages } from '../messages'

export const giveRightsValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const givingRightsObj = newAnswer as GiveRightsObj

  const {
    multipleBirthsRequestDays,
    hasMultipleBirths,
  } = getApplicationAnswers(application.answers)

  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )
  if (
    givingRightsObj.isGivingRights === YES &&
    hasMultipleBirths === YES &&
    multipleBirthsRequestDays * 1 !== 0 &&
    selectedChild?.parentalRelation === ParentalRelations.primary
  ) {
    return buildError(errorMessages.notAllowedToGiveRights, 'transferRights')
  }

  return undefined
}
