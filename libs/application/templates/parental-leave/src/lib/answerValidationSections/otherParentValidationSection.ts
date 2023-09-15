import { coreErrorMessages } from '@island.is/application/core'
import { AnswerValidationConstants, MANUAL } from '../../constants'
import { OtherParentObj } from '../../types'
import isEmpty from 'lodash/isEmpty'
import { buildError } from './utils'
const { OTHER_PARENT } = AnswerValidationConstants

export const otherParentValidationSection = (newAnswer: unknown) => {
  const otherParentObj = newAnswer as OtherParentObj

  // TODO: should we add validation for otherParent's email?

  // If manual option is chosen then user have to insert name and national id
  if (otherParentObj.chooseOtherParent === MANUAL) {
    if (isEmpty(otherParentObj.otherParentId))
      return buildError(
        coreErrorMessages.missingAnswer,
        'otherParentId',
        OTHER_PARENT,
      )
  }

  return undefined
}
