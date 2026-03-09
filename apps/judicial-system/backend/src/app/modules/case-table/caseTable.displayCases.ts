import { NotImplementedException } from '@nestjs/common'

import {
  CaseTableType,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system/types'

import { Case, Defendant } from '../repository'

const expandCaseWithDefendants = (
  c: Case,
  filter: (d: Defendant) => boolean,
) => {
  const jsonCase = c.toJSON()

  return (c.defendants ?? [])
    .filter(filter)
    .map((d) => ({ ...jsonCase, defendants: [d] }))
}

const genericDisplayCases = (cs: Case[]): Case[] => cs

const prisonAdminNotRegisteredDefendantsDisplayCases = (cases: Case[]) =>
  cases.flatMap((caseItem) =>
    expandCaseWithDefendants(caseItem, (d) => {
      return (
        Boolean(d.isSentToPrisonAdmin) &&
        !(d.isRegisteredInPrisonSystem ?? caseItem.isRegisteredInPrisonSystem)
      )
    }),
  )

const prisonAdminRegisteredDefendantsDisplayCases = (cases: Case[]) =>
  cases.flatMap((caseItem) =>
    expandCaseWithDefendants(caseItem, (d) => {
      return Boolean(
        d.isSentToPrisonAdmin &&
          (d.isRegisteredInPrisonSystem ?? caseItem.isRegisteredInPrisonSystem),
      )
    }),
  )

const allDefendantsDisplayCases = (cases: Case[]) =>
  cases.flatMap((caseItem) => expandCaseWithDefendants(caseItem, () => true))

const publicProsecutionOfficeAcceptedDefendantDisplayCases = (cases: Case[]) =>
  cases.flatMap((caseItem) =>
    expandCaseWithDefendants(
      caseItem,
      (defendant) =>
        defendant.indictmentReviewDecision ===
        IndictmentCaseReviewDecision.ACCEPT,
    ),
  )

const publicProsecutionOfficeAppealdDefendantDisplayCases = (cases: Case[]) =>
  cases.flatMap((caseItem) =>
    expandCaseWithDefendants(
      caseItem,
      (defendant) =>
        defendant.indictmentReviewDecision ===
        IndictmentCaseReviewDecision.APPEAL,
    ),
  )

export const caseTableDisplayCases: Record<
  CaseTableType,
  (cases: Case[]) => Case[]
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
    allDefendantsDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW]:
    allDefendantsDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED]:
    publicProsecutionOfficeAcceptedDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEAL_PERIOD_EXPIRED]:
    publicProsecutionOfficeAcceptedDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_SENT_TO_PRISON_ADMIN]:
    publicProsecutionOfficeAcceptedDefendantDisplayCases,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED]:
    publicProsecutionOfficeAppealdDefendantDisplayCases,
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
