import { getValueViaPath } from '@island.is/application/core'
import type { Application } from '@island.is/application/types'

export const hasCourseBeenFullyBooked = (application: Application) =>
  !(
    getValueViaPath<boolean>(
      application.externalData,
      'hhCoursesParticipantAvailability.hasAvailability',
    ) ?? false
  )
