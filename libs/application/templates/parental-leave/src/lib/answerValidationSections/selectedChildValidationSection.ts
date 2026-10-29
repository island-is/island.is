import { Application } from '@island.is/application/types'
import {
  getApplicationExternalData,
  isChildInProgress,
} from '../parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../messages'
import { buildError } from './utils'

/**
 * The select-child screen disables a child that already has an unfinished
 * application, but that is only the browser. Refuse it here as well so a second
 * application for the same leave cannot be started.
 */
export const selectedChildValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  if (typeof newAnswer !== 'string') {
    return undefined
  }

  const { children } = getApplicationExternalData(application.externalData)
  const child = children[Number(newAnswer)]

  if (child && isChildInProgress(child)) {
    return buildError(
      parentalLeaveFormMessages.selectChild.childInProgressError,
      'selectedChild',
    )
  }

  return undefined
}
