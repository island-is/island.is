import { Application } from '@island.is/application/types'
import { errorMessages } from '../messages'
import { getMaxMultipleBirthsDays } from '../parentalLeaveUtils'
import { buildError } from './utils'

/**
 * The schema only caps `multipleBirthsRequestDays` at the largest supported
 * multiple birth. The real maximum depends on how many children were born,
 * which lives in another answer.
 */
export const multipleBirthsRequestDaysValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const days = Number(newAnswer)

  if (isNaN(days) || !Number.isInteger(days) || days < 0) {
    return buildError(
      errorMessages.rightsDaysOutOfRange,
      'multipleBirthsRequestDays',
    )
  }

  const maxDays = getMaxMultipleBirthsDays(application.answers)

  if (!isNaN(maxDays) && days > maxDays) {
    return buildError(
      errorMessages.rightsDaysOutOfRange,
      'multipleBirthsRequestDays',
    )
  }

  return undefined
}
