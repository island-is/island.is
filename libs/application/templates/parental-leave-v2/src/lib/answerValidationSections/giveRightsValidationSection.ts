import { Application } from '@island.is/application/types'
import { GiveRightsObj } from '../../types'
import { getApplicationAnswers, getSelectedChild } from '../parentalLeaveUtils'
import { ParentalRelations, MANUAL } from '../../constants'
import { buildError } from './utils'
import { errorMessages } from '../messages'
import { YES } from '@island.is/application/core'

export const giveRightsValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const givingRightsObj = newAnswer as GiveRightsObj

  const {
    multipleBirthsRequestDays,
    hasMultipleBirths,
    otherParent,
    otherParentRightOfAccess,
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
  if (
    givingRightsObj.isGivingRights === YES &&
    otherParent === MANUAL &&
    otherParentRightOfAccess !== YES &&
    selectedChild?.parentalRelation === ParentalRelations.primary
  ) {
    return buildError(
      errorMessages.notAllowedToGiveRightsOtherParentNotAllowed,
      'transferRights',
    )
  }

  return undefined
}
