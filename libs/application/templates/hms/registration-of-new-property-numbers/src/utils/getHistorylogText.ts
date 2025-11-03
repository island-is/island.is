import { coreHistoryMessages } from '@island.is/application/core'
import { StaticText } from '@island.is/shared/types'
import { application } from '../lib/messages'

export const getHistoryLogSentWithSubjectAndActor = ({
  subject,
  actor,
}: {
  subject?: string
  actor?: string
}): StaticText => {
  //use fallback for older historylogs where nationalId info is missing
  if (!subject) return coreHistoryMessages.applicationSent

  //if actor is null or if actor is the same as subject return contentfulId with no actor
  return !actor || subject === actor
    ? coreHistoryMessages.applicationSent
    : application.sentInWithActor
}
