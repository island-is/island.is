import { WhereOptions } from 'sequelize'

import {
  CaseTableType,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isProsecutorRepresentativeUser,
  isProsecutorUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
  type User,
} from '@island.is/judicial-system/types'

import {
  courtOfAppealsCasesAccessWhereOptions,
  districtCourtCasesAccessWhereOptions,
  prisonAdminCasesAccessWhereOptions,
  prisonStaffCasesAccessWhereOptions,
  prosecutorCasesAccessWhereOptions,
  prosecutorRepresentativeCasesAccessWhereOptions,
  publicProsecutionCasesAccessWhereOptions,
  publicProsecutionOfficeCasesAccessWhereOptions,
} from './whereOptions/access'
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
  prisonAdminIndictmentsRegisteredRulingWhereOptions,
  prisonAdminIndictmentsSentToPrisonAdminWhereOptions,
  prisonAdminRequestCasesActiveWhereOptions,
  prisonAdminRequestCasesDoneWhereOptions,
} from './whereOptions/prisonAdmin'
import {
  prisonStaffRequestCasesActiveWhereOptions,
  prisonStaffRequestCasesDoneWhereOptions,
} from './whereOptions/prisonStaff'
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

export const userAccessWhereOptions = (user: User): WhereOptions => {
  if (isCourtOfAppealsUser(user)) {
    return courtOfAppealsCasesAccessWhereOptions()
  }

  if (isDistrictCourtUser(user)) {
    return districtCourtCasesAccessWhereOptions(user)
  }

  if (isPrisonStaffUser(user)) {
    return prisonStaffCasesAccessWhereOptions()
  }

  if (isPrisonAdminUser(user)) {
    return prisonAdminCasesAccessWhereOptions()
  }

  if (isPublicProsecutionOfficeUser(user)) {
    return publicProsecutionOfficeCasesAccessWhereOptions()
  }

  if (isPublicProsecutionUser(user)) {
    return publicProsecutionCasesAccessWhereOptions(user)
  }

  if (isProsecutorUser(user)) {
    return prosecutorCasesAccessWhereOptions(user)
  }

  if (isProsecutorRepresentativeUser(user)) {
    return prosecutorRepresentativeCasesAccessWhereOptions(user)
  }

  return { id: null }
}

export const caseTableWhereOptions: Record<
  CaseTableType,
  (user: User) => WhereOptions
> = {
  [CaseTableType.COURT_OF_APPEALS_REQUEST_CASES_IN_PROGRESS]:
    courtOfAppealsRequestCasesInProgressWhereOptions,
  [CaseTableType.COURT_OF_APPEALS_REQUEST_CASES_COMPLETED]:
    courtOfAppealsRequestCasesCompletedWhereOptions,
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS]:
    districtCourtRequestCasesInProgressWhereOptions,
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED]:
    districtCourtRequestCasesAppealedWhereOptions,
  [CaseTableType.DISTRICT_COURT_REQUEST_CASES_COMPLETED]:
    districtCourtRequestCasesCompletedWhereOptions,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_NEW]:
    districtCourtIndictmentsNewWhereOptions,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_RECEIVED]:
    districtCourtIndictmentsReceivedWhereOptions,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_IN_PROGRESS]:
    districtCourtIndictmentsInProgressWhereOptions,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_FINALIZING]:
    districtCourtIndictmentsFinalizingWhereOptions,
  [CaseTableType.DISTRICT_COURT_INDICTMENTS_COMPLETED]:
    districtCourtIndictmentsCompletedWhereOptions,
  [CaseTableType.PRISON_STAFF_REQUEST_CASES_ACTIVE]:
    prisonStaffRequestCasesActiveWhereOptions,
  [CaseTableType.PRISON_STAFF_REQUEST_CASES_DONE]:
    prisonStaffRequestCasesDoneWhereOptions,
  [CaseTableType.PRISON_ADMIN_REQUEST_CASES_ACTIVE]:
    prisonAdminRequestCasesActiveWhereOptions,
  [CaseTableType.PRISON_ADMIN_REQUEST_CASES_DONE]:
    prisonAdminRequestCasesDoneWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENTS_SENT_TO_PRISON_ADMIN]:
    prisonAdminIndictmentsSentToPrisonAdminWhereOptions,
  [CaseTableType.PRISON_ADMIN_INDICTMENTS_REGISTERED_RULING]:
    prisonAdminIndictmentsRegisteredRulingWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_NEW]:
    publicProsecutionOfficeIndictmentsNewWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW]:
    publicProsecutionOfficeIndictmentsInReviewWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED]:
    publicProsecutionOfficeIndictmentsReviewedWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEAL_PERIOD_EXPIRED]:
    publicProsecutionOfficeIndictmentsAppealPeriodExpiredWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_SENT_TO_PRISON_ADMIN]:
    publicProsecutionOfficeIndictmentsSentToPrisonAdminWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED]:
    publicProsecutionOfficeIndictmentsAppealedWhereOptions,
  [CaseTableType.PROSECUTION_REQUEST_CASES_IN_PROGRESS]:
    prosecutionRequestCasesInProgressWhereOptions,
  [CaseTableType.PROSECUTION_REQUEST_CASES_ACTIVE]:
    prosecutionRequestCasesActiveWhereOptions,
  [CaseTableType.PROSECUTION_REQUEST_CASES_APPEALED]:
    prosecutionRequestCasesAppealedWhereOptions,
  [CaseTableType.PROSECUTION_REQUEST_CASES_COMPLETED]:
    prosecutionRequestCasesCompletedWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW]:
    publicProsecutionIndictmentsInReviewWhereOptions,
  [CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_REVIEWED]:
    publicProsecutionIndictmentsReviewedWhereOptions,
  [CaseTableType.PROSECUTION_INDICTMENTS_IN_DRAFT]:
    prosecutionIndictmentsInDraftWhereOptions,
  [CaseTableType.PROSECUTION_INDICTMENTS_WAITING_FOR_CONFIRMATION]:
    prosecutionIndictmentsWaitingForConfirmationWhereOptions,
  [CaseTableType.PROSECUTION_INDICTMENTS_IN_PROGRESS]:
    prosecutionIndictmentsInProgressWhereOptions,
  [CaseTableType.PROSECUTION_INDICTMENTS_COMPLETED]:
    prosecutionIndictmentsCompletedWhereOptions,
}
