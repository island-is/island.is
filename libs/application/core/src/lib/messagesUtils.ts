import { StaticText } from '@island.is/application/types'
import { coreHistoryMessages } from './messages'

export const getHistoryLogApprovedWithSubjectAndActor = ({
  subject,
  actor,
}: {
  subject?: string
  actor?: string
}): StaticText => {
  //use fallback for older historylogs where nationalId info is missing
  if (!subject) return coreHistoryMessages.applicationApprovedByReviewerFallback

  //if actor is null or if actor is the same as subject return contentfulId with no actor
  return !actor || subject === actor
    ? coreHistoryMessages.applicationApprovedByReviewer
    : coreHistoryMessages.applicationApprovedByReviewerWithActor
}

export const getHistoryLogRejectedWithSubjectAndActor = ({
  subject,
  actor,
}: {
  subject?: string
  actor?: string
}): StaticText => {
  //use fallback for older historylogs where nationalId info is missing
  if (!subject) return coreHistoryMessages.applicationRejectedByReviewerFallback

  //if actor is null or if actor is the same as subject return contentfulId with no actor
  return !actor || subject === actor
    ? coreHistoryMessages.applicationRejectedByReviewer
    : coreHistoryMessages.applicationRejectedByReviewerWithActor
}
