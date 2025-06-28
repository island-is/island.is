import { InstitutionUser } from '../user'
import {
  courtOfAppealsRequestCasesCompleted,
  courtOfAppealsRequestCasesInProgress,
} from './caseTables/courtOfAppeals'
import {
  districtCourtIndictmentsCompleted,
  districtCourtIndictmentsFinalizing,
  districtCourtIndictmentsInProgress,
  districtCourtIndictmentsNew,
  districtCourtIndictmentsReceived,
  districtCourtRequestCasesAppealed,
  districtCourtRequestCasesCompleted,
  districtCourtRequestCasesInProgress,
} from './caseTables/districtCourt'
import {
  prisonRequestCasesActive,
  prisonRequestCasesDone,
} from './caseTables/prison'
import {
  prisonAdminIndictmentsRegisteredRuling,
  prisonAdminIndictmentsSentToPrisonAdmin,
  prisonAdminRequestCasesActive,
  prisonAdminRequestCasesDone,
} from './caseTables/prisonAdmin'
import {
  prosecutionIndictmentsCompleted,
  prosecutionIndictmentsInDraft,
  prosecutionIndictmentsInProgress,
  prosecutionIndictmentsWaitingForConfirmation,
  prosecutionRequestCasesActive,
  prosecutionRequestCasesAppealed,
  prosecutionRequestCasesCompleted,
  prosecutionRequestCasesInProgress,
  publicProsecutionIndictmentsInReview,
  publicProsecutionIndictmentsReviewed,
} from './caseTables/prosecution'
import {
  publicProsecutionOfficeIndictmentsAppealed,
  publicProsecutionOfficeIndictmentsAppealPeriodExpired,
  publicProsecutionOfficeIndictmentsInReview,
  publicProsecutionOfficeIndictmentsNew,
  publicProsecutionOfficeIndictmentsReviewed,
  publicProsecutionOfficeIndictmentsSentToPrisonAdmin,
} from './caseTables/publicProsecutionOffice'
import { getCaseTableGroups } from './caseTableGroup'
import { CaseTable, CaseTableType } from './caseTableTypes'

export const getCaseTableType = (
  user: InstitutionUser | undefined,
  route: string | undefined,
): CaseTableType | undefined => {
  const tableGroups = getCaseTableGroups(user)

  for (const tableGroup of tableGroups) {
    for (const table of tableGroup.tables) {
      if (table.route === route) {
        return table.type
      }
    }
  }
}

export const caseTables: Record<CaseTableType, CaseTable> = {
  COURT_OF_APPEALS_REQUEST_CASES_IN_PROGRESS:
    courtOfAppealsRequestCasesInProgress,
  COURT_OF_APPEALS_REQUEST_CASES_COMPLETED: courtOfAppealsRequestCasesCompleted,
  DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS: districtCourtRequestCasesInProgress,
  DISTRICT_COURT_REQUEST_CASES_APPEALED: districtCourtRequestCasesAppealed,
  DISTRICT_COURT_REQUEST_CASES_COMPLETED: districtCourtRequestCasesCompleted,
  DISTRICT_COURT_INDICTMENTS_NEW: districtCourtIndictmentsNew,
  DISTRICT_COURT_INDICTMENTS_RECEIVED: districtCourtIndictmentsReceived,
  DISTRICT_COURT_INDICTMENTS_IN_PROGRESS: districtCourtIndictmentsInProgress,
  DISTRICT_COURT_INDICTMENTS_FINALIZING: districtCourtIndictmentsFinalizing,
  DISTRICT_COURT_INDICTMENTS_COMPLETED: districtCourtIndictmentsCompleted,
  PRISON_REQUEST_CASES_ACTIVE: prisonRequestCasesActive,
  PRISON_REQUEST_CASES_DONE: prisonRequestCasesDone,
  PRISON_ADMIN_REQUEST_CASES_ACTIVE: prisonAdminRequestCasesActive,
  PRISON_ADMIN_REQUEST_CASES_DONE: prisonAdminRequestCasesDone,
  PRISON_ADMIN_INDICTMENTS_SENT_TO_PRISON_ADMIN:
    prisonAdminIndictmentsSentToPrisonAdmin,
  PRISON_ADMIN_INDICTMENTS_REGISTERED_RULING:
    prisonAdminIndictmentsRegisteredRuling,
  PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_NEW:
    publicProsecutionOfficeIndictmentsNew,
  PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW:
    publicProsecutionOfficeIndictmentsInReview,
  PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED:
    publicProsecutionOfficeIndictmentsReviewed,
  PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEAL_PERIOD_EXPIRED:
    publicProsecutionOfficeIndictmentsAppealPeriodExpired,
  PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_SENT_TO_PRISON_ADMIN:
    publicProsecutionOfficeIndictmentsSentToPrisonAdmin,
  PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED:
    publicProsecutionOfficeIndictmentsAppealed,
  PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW:
    publicProsecutionIndictmentsInReview,
  PUBLIC_PROSECUTION_INDICTMENTS_REVIEWED: publicProsecutionIndictmentsReviewed,
  PROSECUTION_REQUEST_CASES_IN_PROGRESS: prosecutionRequestCasesInProgress,
  PROSECUTION_REQUEST_CASES_ACTIVE: prosecutionRequestCasesActive,
  PROSECUTION_REQUEST_CASES_APPEALED: prosecutionRequestCasesAppealed,
  PROSECUTION_REQUEST_CASES_COMPLETED: prosecutionRequestCasesCompleted,
  PROSECUTION_INDICTMENTS_IN_DRAFT: prosecutionIndictmentsInDraft,
  PROSECUTION_INDICTMENTS_WAITING_FOR_CONFIRMATION:
    prosecutionIndictmentsWaitingForConfirmation,
  PROSECUTION_INDICTMENTS_IN_PROGRESS: prosecutionIndictmentsInProgress,
  PROSECUTION_INDICTMENTS_COMPLETED: prosecutionIndictmentsCompleted,
}
