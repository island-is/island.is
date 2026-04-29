import type { AnswerValidator } from '@island.is/application/types'

import { RentalHousingCategoryClass } from '../utils/constants'
import { propertyInfo as propertyInfoMsgs } from './messages'

const categoryClassKey = 'propertyInfo.categoryClass'
const categoryClassGroupKey = 'propertyInfo.categoryClassGroup'

const requiresCategoryClassGroup: AnswerValidator = (_newAnswer, application) => {
  const answers = application.answers
  const categoryClass = answers[categoryClassKey]
  const categoryClassGroup = answers[categoryClassGroupKey]

  if (categoryClass !== RentalHousingCategoryClass.SPECIAL_GROUPS) {
    return undefined
  }

  if (
    typeof categoryClassGroup === 'string' &&
    categoryClassGroup.trim().length > 0
  ) {
    return undefined
  }

  return {
    path: categoryClassGroupKey,
    message: propertyInfoMsgs.categoryClassGroupRequiredError,
  }
}

export const answerValidators: Record<string, AnswerValidator> = {
  [categoryClassKey]: requiresCategoryClassGroup,
  [categoryClassGroupKey]: requiresCategoryClassGroup,
}
