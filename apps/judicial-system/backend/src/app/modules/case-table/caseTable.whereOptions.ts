import { WhereOptions } from 'sequelize'

import {
  CaseTableType,
  isDistrictCourtUser,
  type User as TUser,
} from '@island.is/judicial-system/types'

import {
  courtOfAppealsRequestCasesCompletedWhereOptions,
  courtOfAppealsRequestCasesInProgressWhereOptions,
} from './whereOptions/courtOfAppeals'
import {
  districtCourtIndictmentsCompletedWhereOptions,
  districtCourtIndictmentsFinalizingWhereOptions,
  districtCourtIndictmentsInProgressWhereOptions,
  districtCourtIndictmentsNewWhereOptions,
  districtCourtIndictmentsReceivedWhereOptions,
  districtCourtRequestCasesAppealedWhereOptions,
  districtCourtRequestCasesCompletedWhereOptions,
  districtCourtRequestCasesInProgressWhereOptions,
} from './whereOptions/districtCourt'
import {
  prisonRequestCasesActiveWhereOptions,
  prisonRequestCasesDoneWhereOptions,
} from './whereOptions/prison'
import {
  prisonAdminIndictmentsRegisteredRulingWhereOptions,
  prisonAdminIndictmentsSentToPrisonAdminWhereOptions,
  prisonAdminRequestCasesActiveWhereOptions,
  prisonAdminRequestCasesDoneWhereOptions,
} from './whereOptions/prisonAdmin'
import {
  prosecutionIndictmentsCompletedWhereOptions,
  prosecutionIndictmentsInDraftWhereOptions,
  prosecutionIndictmentsInProgressWhereOptions,
  prosecutionIndictmentsWaitingForConfirmationWhereOptions,
  prosecutionRequestCasesActiveWhereOptions,
  prosecutionRequestCasesAppealedWhereOptions,
  prosecutionRequestCasesCompletedWhereOptions,
  prosecutionRequestCasesInProgressWhereOptions,
} from './whereOptions/prosecution'
import {
  publicProsecutionIndictmentsInReviewWhereOptions,
  publicProsecutionIndictmentsReviewedWhereOptions,
} from './whereOptions/publicProsecution'
import {
  publicProsecutionOfficeIndictmentsAppealedWhereOptions,
  publicProsecutionOfficeIndictmentsAppealPeriodExpiredWhereOptions,
  publicProsecutionOfficeIndictmentsInReviewWhereOptions,
  publicProsecutionOfficeIndictmentsNewWhereOptions,
  publicProsecutionOfficeIndictmentsReviewedWhereOptions,
  publicProsecutionOfficeIndictmentsSentToPrisonAdminWhereOptions,
} from './whereOptions/publicProsecutionOffice'

const withUserFilter = (
  whereOptions: WhereOptions,
  user: TUser,
): WhereOptions => {
  return isDistrictCourtUser(user)
    ? { ...whereOptions, court_id: user.institution?.id }
    : whereOptions
}

export const caseTableWhereOptions: Record<
  CaseTableType,
  (user: TUser) => WhereOptions
> = {
  [CaseTableType.COURT_OF_APPEALS_REQUEST_CASES_IN_PROGRESS]: () =>
    courtOfAppealsRequestCasesInProgressWhereOptions,
  [CaseTableType.COURT_OF_APPEALS_REQUEST_CASES_COMPLETED]: () =>
    courtOfAppealsRequestCasesCompletedWhereOptions,
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS]: (user) =>
    withUserFilter(districtCourtRequestCasesInProgressWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED]: (user) =>
    withUserFilter(districtCourtRequestCasesAppealedWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_COMPLETED]: (user) =>
    withUserFilter(districtCourtRequestCasesCompletedWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_NEW]: (user) =>
    withUserFilter(districtCourtIndictmentsNewWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_RECEIVED]: (user) =>
    withUserFilter(districtCourtIndictmentsReceivedWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_IN_PROGRESS]: (user) =>
    withUserFilter(districtCourtIndictmentsInProgressWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_FINALIZING]: (user) =>
    withUserFilter(districtCourtIndictmentsFinalizingWhereOptions, user),
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_COMPLETED]: (user) =>
    withUserFilter(districtCourtIndictmentsCompletedWhereOptions, user),
  [CaseTableType.PRISON_REQUEST_CASES_ACTIVE]: () =>
    prisonRequestCasesActiveWhereOptions,
  [CaseTableType.PRISON_REQUEST_CASES_DONE]: () =>
    prisonRequestCasesDoneWhereOptions,
  [CaseTableType.PRISON_ADMIN_REQUEST_CASES_ACTIVE]: () =>
    prisonAdminRequestCasesActiveWhereOptions,
  [CaseTableType.PRISON_ADMIN_REQUEST_CASES_DONE]: () =>
    prisonAdminRequestCasesDoneWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENTS_SENT_TO_PRISON_ADMIN]: () =>
    prisonAdminIndictmentsSentToPrisonAdminWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENTS_REGISTERED_RULING]: () =>
    prisonAdminIndictmentsRegisteredRulingWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_NEW]: () =>
    publicProsecutionOfficeIndictmentsNewWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW]: () =>
    publicProsecutionOfficeIndictmentsInReviewWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED]: () =>
    publicProsecutionOfficeIndictmentsReviewedWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEAL_PERIOD_EXPIRED]:
    () => publicProsecutionOfficeIndictmentsAppealPeriodExpiredWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_SENT_TO_PRISON_ADMIN]:
    () => publicProsecutionOfficeIndictmentsSentToPrisonAdminWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED]: () =>
    publicProsecutionOfficeIndictmentsAppealedWhereOptions,
  [CaseTableType.PROSECUTION_REQUEST_CASES_IN_PROGRESS]: (user) =>
    prosecutionRequestCasesInProgressWhereOptions(user),
  [CaseTableType.PROSECUTION_REQUEST_CASES_ACTIVE]: (user) =>
    prosecutionRequestCasesActiveWhereOptions(user),
  [CaseTableType.PROSECUTION_REQUEST_CASES_APPEALED]: (user) =>
    prosecutionRequestCasesAppealedWhereOptions(user),
  [CaseTableType.PROSECUTION_REQUEST_CASES_COMPLETED]: (user) =>
    prosecutionRequestCasesCompletedWhereOptions(user),
  [CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW]: (user) =>
    publicProsecutionIndictmentsInReviewWhereOptions(user),
  [CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_REVIEWED]: (user) =>
    publicProsecutionIndictmentsReviewedWhereOptions(user),
  [CaseTableType.PROSECUTION_INDICTMENTS_IN_DRAFT]: (user) =>
    prosecutionIndictmentsInDraftWhereOptions(user),
  [CaseTableType.PROSECUTION_INDICTMENTS_WAITING_FOR_CONFIRMATION]: (user) =>
    prosecutionIndictmentsWaitingForConfirmationWhereOptions(user),
  [CaseTableType.PROSECUTION_INDICTMENTS_IN_PROGRESS]: (user) =>
    prosecutionIndictmentsInProgressWhereOptions(user),
  [CaseTableType.PROSECUTION_INDICTMENTS_COMPLETED]: (user) =>
    prosecutionIndictmentsCompletedWhereOptions(user),
}
