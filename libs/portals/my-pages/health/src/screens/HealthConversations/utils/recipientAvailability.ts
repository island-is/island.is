import { HealthDirectorateHealthConversationRecipientAvailability as Availability } from '@island.is/api/schema'

interface Recipient {
  availability: Availability
  treatmentId?: string | null
}

export type NewConversationPageMode = 'contactOnly' | 'allClosed' | 'form'

export const getNewConversationPageMode = (
  recipients: Recipient[],
): NewConversationPageMode => {
  if (recipients.every((r) => r.availability === Availability.NEVER))
    return 'contactOnly'
  return recipients.some((r) => r.availability === Availability.OPEN)
    ? 'form'
    : 'allClosed'
}

// No treatmentId means a clinic, not a care team. Prefer it for the hours shown.
export const pickClosedRecipient = <T extends Recipient>(
  recipients: T[],
): T | undefined => {
  const closed = recipients.filter(
    (r) => r.availability === Availability.CLOSED,
  )
  return closed.find((r) => !r.treatmentId) ?? closed[0]
}
