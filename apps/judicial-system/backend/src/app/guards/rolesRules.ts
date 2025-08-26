import type { RolesRule } from '@island.is/judicial-system/auth'
import { UserRole } from '@island.is/judicial-system/types'

// Allows prosecutors to perform any action
export const prosecutorRule: RolesRule = UserRole.PROSECUTOR

// Allows prosecutor representatives to perform any action
export const prosecutorRepresentativeRule: RolesRule =
  UserRole.PROSECUTOR_REPRESENTATIVE

// Allows district court judges to perform any action
export const districtCourtJudgeRule: RolesRule = UserRole.DISTRICT_COURT_JUDGE

// Allows district court registrars to perform any action
export const districtCourtRegistrarRule: RolesRule =
  UserRole.DISTRICT_COURT_REGISTRAR

// Allows district court assistants to perform any action
export const districtCourtAssistantRule: RolesRule =
  UserRole.DISTRICT_COURT_ASSISTANT

// Allows court of appeals judges to perform any action
export const courtOfAppealsJudgeRule: RolesRule =
  UserRole.COURT_OF_APPEALS_JUDGE

// Allows court of appeals registrars to perform any action
export const courtOfAppealsRegistrarRule: RolesRule =
  UserRole.COURT_OF_APPEALS_REGISTRAR

// Allows court of appeals assistants to perform any action
export const courtOfAppealsAssistantRule: RolesRule =
  UserRole.COURT_OF_APPEALS_ASSISTANT

// Allows prison system staff to perform any action
export const prisonSystemStaffRule: RolesRule = UserRole.PRISON_SYSTEM_STAFF

// Allows local admins to perform any action
export const localAdminRule: RolesRule = UserRole.LOCAL_ADMIN

// Allows super admins to perform any action
export const adminRule: RolesRule = UserRole.ADMIN

// Allows defenders to perform any action
export const defenderRule: RolesRule = UserRole.DEFENDER

// Allows public prosecutor staff to perform any action
export const publicProsecutorStaffRule: RolesRule =
  UserRole.PUBLIC_PROSECUTOR_STAFF
