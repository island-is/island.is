import { formatDate } from '@island.is/judicial-system/formatters'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { AppealEventType } from '@island.is/judicial-system-web/src/graphql/schema'

/**
 * When the verdict appeal reached the Court of Appeals.
 *
 * Provisional: there is no record of the appeal arriving yet, so the earliest
 * registered appeal stands in for it - which is the same thing the court's "Mál
 * í vinnslu" list goes by today. The áfrýjunarstefna is what will eventually
 * mark the arrival, and this moves to it when the ticket that creates it lands.
 *
 * The earliest rather than the latest: a case with two defendants carries an
 * APPEALED event per appealing party, and what the court is being told is when
 * the proceeding began.
 */
export const getVerdictAppealReceivedDate = (
  theCase: Pick<WorkingCase, 'verdictAppealCase'>,
): string | undefined => {
  let earliest: string | undefined

  for (const eventLog of theCase.verdictAppealCase?.appealEventLogs ?? []) {
    if (eventLog.eventType !== AppealEventType.APPEALED || !eventLog.created) {
      continue
    }

    if (!earliest || eventLog.created < earliest) {
      earliest = eventLog.created
    }
  }

  return earliest
}

/**
 * The lines under the page title: which case this is, when it was decided and
 * when the appeal of it arrived here.
 *
 * A line is left out rather than shown empty when its date is missing, so the
 * header says only what is known - the page opens on an appeal that has barely
 * begun as readily as on a finished one.
 */
export const getVerdictAppealOverviewHeaderLines = (
  theCase: Pick<
    WorkingCase,
    'courtCaseNumber' | 'rulingDate' | 'verdictAppealCase'
  >,
): string[] => {
  const lines: string[] = []

  if (theCase.courtCaseNumber) {
    lines.push(`Héraðsdómsmál ${theCase.courtCaseNumber}`)
  }

  if (theCase.rulingDate) {
    lines.push(`Dómsuppkvaðning ${formatDate(theCase.rulingDate, 'PPP')}`)
  }

  const receivedDate = getVerdictAppealReceivedDate(theCase)

  if (receivedDate) {
    lines.push(`Áfrýjun barst Landsrétti ${formatDate(receivedDate, 'PPP')}`)
  }

  return lines
}
