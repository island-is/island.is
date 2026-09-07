import { BadRequestException } from '@nestjs/common'

import {
  CaseIndictmentRulingDecision,
  getDefendantServiceDate,
  getIndictmentAppealDeadline,
} from '@island.is/judicial-system/types'

import { Verdict } from '../repository'

/**
 * Guards the acts that *are* an appeal of a verdict - the defendant appealing
 * from the app, and a defender filing an appeal declaration - as opposed to the
 * public prosecution office's bookkeeping about an appeal that already happened,
 * which its own path deliberately allows after the deadline has run out. Here
 * the deadline is hard. Note that it runs until midnight at the end of its last
 * day - see getIndictmentAppealDeadline.
 */
export const validateVerdictAppealUpdate = ({
  caseId,
  indictmentRulingDecision,
  rulingDate,
  verdict,
}: {
  caseId: string
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate?: Date
  verdict: Verdict
}) => {
  if (!rulingDate) {
    throw new BadRequestException(
      `Cannot register appeal – No ruling date has been set for case ${caseId}`,
    )
  }

  const baseDate = getDefendantServiceDate({
    verdict,
    fallbackDate: rulingDate,
  })

  // this can only be thrown if service date is not set
  if (!baseDate) {
    throw new BadRequestException(
      `Cannot register appeal – Service date not set for case ${caseId}`,
    )
  }
  const { deadlineDate, isDeadlineExpired } = getIndictmentAppealDeadline({
    baseDate: new Date(baseDate),
    isFine: indictmentRulingDecision === CaseIndictmentRulingDecision.FINE,
  })
  if (isDeadlineExpired) {
    throw new BadRequestException(
      `Appeal deadline has passed for case ${caseId}. Deadline was ${deadlineDate.toISOString()}`,
    )
  }
}
