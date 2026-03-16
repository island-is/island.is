import { NotImplementedException } from '@nestjs/common'

import {
  CaseTableType,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system/types'

import { Case, Defendant } from '../repository'

const isSentToPrisonAdmin = (d: Defendant) => Boolean(d.isSentToPrisonAdmin)

const isRegisteredInPrisonSystem = (d: Defendant, c: Case): boolean =>
  Boolean(d.isRegisteredInPrisonSystem ?? c.isRegisteredInPrisonSystem)

const isAcquittedByPublicProsecutionOffice = (d: Defendant) =>
  Boolean(d.verdicts?.[0]?.isAcquittedByPublicProsecutionOffice)

const isNotAcquittedByPublicProsecutionOffice = (d: Defendant) =>
  !isAcquittedByPublicProsecutionOffice(d)

const isAppealRequestLatestVerdict = (defendant: Defendant) =>
  Boolean(defendant.verdicts?.[0]?.defendantHasRequestedAppeal)

const isNotAppealRequestLatestVerdict = (defendant: Defendant) =>
  !isAppealRequestLatestVerdict(defendant)

const isAcceptedIndictmentReviewDecision = (d: Defendant) =>
  isNotAcquittedByPublicProsecutionOffice(d) &&
  isNotAppealRequestLatestVerdict(d) &&
  d.indictmentReviewDecision === IndictmentCaseReviewDecision.ACCEPT

const isAppealedIndictmentReviewDecision = (d: Defendant) =>
  isNotAcquittedByPublicProsecutionOffice(d) &&
  isNotAppealRequestLatestVerdict(d) &&
  d.indictmentReviewDecision === IndictmentCaseReviewDecision.APPEAL

const expandCaseWithDefendants = (
  c: Case,
  filter: (d: Defendant) => boolean,
) => {
  const jsonCase = c.toJSON()

  return (c.defendants ?? [])
    .filter(filter)
    .map((d) => ({ ...jsonCase, defendants: [d] }))
}

const genericDisplayCases = (cs: Case[]) => cs.map((c) => c.toJSON())

const prisonAdminNotRegisteredDefendantsDisplayCases = (cs: Case[]) =>
  cs.flatMap((c) =>
    expandCaseWithDefendants(
      c,
      (d) => isSentToPrisonAdmin(d) && !isRegisteredInPrisonSystem(d, c),
    ),
  )

const prisonAdminRegisteredDefendantsDisplayCases = (cs: Case[]) =>
  cs.flatMap((c) =>
    expandCaseWithDefendants(
      c,
      (d) => isSentToPrisonAdmin(d) && isRegisteredInPrisonSystem(d, c),
    ),
  )

const publicProsecutionOfficeNewOrInReviewDefendantDisplayCases = (
  cs: Case[],
) =>
  cs.flatMap((c) =>
    expandCaseWithDefendants(
      c,
      (d) =>
        isNotAcquittedByPublicProsecutionOffice(d) &&
        isNotAppealRequestLatestVerdict(d),
    ),
  )

const publicProsecutionOfficeAcceptedDefendantDisplayCases = (cs: Case[]) =>
  cs.flatMap((c) =>
    expandCaseWithDefendants(c, isAcceptedIndictmentReviewDecision),
  )

const publicProsecutionOfficeAppealedDefendantDisplayCases = (cs: Case[]) =>
  cs.flatMap((c) =>
    expandCaseWithDefendants(c, isAppealedIndictmentReviewDecision),
  )

const publicProsecutionOfficeAcquittedDefendantDisplayCases = (cs: Case[]) =>
  cs.flatMap((c) =>
    expandCaseWithDefendants(c, isAcquittedByPublicProsecutionOffice),
  )

const publicProsecutionOfficeRequestedAppealDefendantDisplayCases = (
  cs: Case[],
) =>
  cs.flatMap((c) => expandCaseWithDefendants(c, isAppealRequestLatestVerdict))

export const caseTableDisplayCases: Record<
  CaseTableType,
  (cs: Case[]) => ReturnType<typeof genericDisplayCases>
> = {
  [CaseTableType.COURT_OF_APPEALS_REQUEST_CASES_IN_PROGRESS]:
    genericDisplayCases,
  [CaseTableType.COURT_OF_APPEALS_REQUEST_CASES_COMPLETED]: genericDisplayCases,
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS]: genericDisplayCases,
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED]: genericDisplayCases,
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_COMPLETED]: genericDisplayCases,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_NEW]: genericDisplayCases,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_RECEIVED]: genericDisplayCases,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_IN_PROGRESS]: genericDisplayCases,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_FINALIZING]: genericDisplayCases,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_COMPLETED]: genericDisplayCases,
  [CaseTableType.PRISON_STAFF_REQUEST_CASES_ACTIVE]: genericDisplayCases,
  [CaseTableType.PRISON_STAFF_REQUEST_CASES_DONE]: genericDisplayCases,
  [CaseTableType.PRISON_ADMIN_REQUEST_CASES_ACTIVE]: genericDisplayCases,
  [CaseTableType.PRISON_ADMIN_REQUEST_CASES_DONE]: genericDisplayCases,
  [CaseTableType.PRISON_ADMIN_INDICTMENTS_SENT_TO_PRISON_ADMIN]:
    prisonAdminNotRegisteredDefendantsDisplayCases,
  [CaseTableType.PRISON_ADMIN_INDICTMENTS_REGISTERED_RULING]:
    prisonAdminRegisteredDefendantsDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_NEW]:
    publicProsecutionOfficeNewOrInReviewDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW]:
    publicProsecutionOfficeNewOrInReviewDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED]:
    publicProsecutionOfficeAcceptedDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEAL_PERIOD_EXPIRED]:
    publicProsecutionOfficeAcceptedDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_SENT_TO_PRISON_ADMIN]:
    publicProsecutionOfficeAcceptedDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED]:
    publicProsecutionOfficeAppealedDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_ACQUITTED_INDICTMENTS]:
    publicProsecutionOfficeAcquittedDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REQUESTED_APPEAL]:
    publicProsecutionOfficeRequestedAppealDefendantDisplayCases,
  [CaseTableType.PROSECUTION_REQUEST_CASES_IN_PROGRESS]: genericDisplayCases,
  [CaseTableType.PROSECUTION_REQUEST_CASES_ACTIVE]: genericDisplayCases,
  [CaseTableType.PROSECUTION_REQUEST_CASES_APPEALED]: genericDisplayCases,
  [CaseTableType.PROSECUTION_REQUEST_CASES_COMPLETED]: genericDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW]: genericDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_REVIEWED]: genericDisplayCases,
  [CaseTableType.PROSECUTION_INDICTMENTS_IN_DRAFT]: genericDisplayCases,
  [CaseTableType.PROSECUTION_INDICTMENTS_WAITING_FOR_CONFIRMATION]:
    genericDisplayCases,
  [CaseTableType.PROSECUTION_INDICTMENTS_IN_PROGRESS]: genericDisplayCases,
  [CaseTableType.PROSECUTION_INDICTMENTS_COMPLETED]: genericDisplayCases,
  [CaseTableType.STATISTICS]: () => {
    throw new NotImplementedException('Case table type not implemented')
  },
}
