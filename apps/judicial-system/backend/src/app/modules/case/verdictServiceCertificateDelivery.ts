import { DefendantEventType } from '@island.is/judicial-system/types'

import { DefendantEventLog, Verdict } from '../repository'

export const wasVerdictServiceCertificateDeliveredToPolice = (
  eventLogs: DefendantEventLog[] | undefined,
  verdict: Pick<Verdict, 'id' | 'created'>,
): boolean => {
  return (
    eventLogs?.some((eventLog) => {
      if (
        eventLog.eventType !==
        DefendantEventType.VERDICT_SERVICE_CERTIFICATE_DELIVERED_TO_POLICE
      ) {
        return false
      }

      if (eventLog.verdictId === verdict.id) {
        return true
      }

      // Pre-backfill / leftover null: treat as delivered for this verdict
      // only if the verdict already existed when the event was written
      // (so a later replacement verdict still delivers).
      return (
        (eventLog.verdictId === undefined || eventLog.verdictId === null) &&
        verdict.created <= eventLog.created
      )
    }) ?? false
  )
}
