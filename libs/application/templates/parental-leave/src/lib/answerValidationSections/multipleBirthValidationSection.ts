import { defaultMultipleBirthsMonths } from '../../config'
import { YES } from '../../constants'
import { MultipleBirths } from '../../types'
import { errorMessages } from '../messages'
import { buildError } from './utils'

export const multipleBirthValidationSection = (newAnswer: unknown) => {
  const obj = newAnswer as MultipleBirths

  if (obj.hasMultipleBirths === YES) {
    if (!obj.multipleBirths) {
      return buildError(
        errorMessages.missingMultipleBirthsAnswer,
        'multipleBirths',
      )
    }
    if (obj.multipleBirths < 2) {
      return buildError(
        errorMessages.tooFewMultipleBirthsAnswer,
        'multipleBirths',
      )
    }
    if (obj.multipleBirths > defaultMultipleBirthsMonths + 1) {
      return buildError(
        errorMessages.tooManyMultipleBirthsAnswer,
        'multipleBirths',
      )
    }
  }
  return undefined
}
