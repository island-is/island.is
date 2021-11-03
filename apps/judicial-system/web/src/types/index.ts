import type { Case, User } from '@island.is/judicial-system/types'
import type { Validation } from '../utils/validate'

export enum AppealDecisionRole {
  PROSECUTOR = 'PROSECUTOR',
  ACCUSED = 'ACCUSED',
}

// export interface RequiredField {
//   value: string
//   validations: Validation[]
// }

export enum Sections {
  PROSECUTOR = 0,
  JUDGE = 1,
  // We skip 2 because that step has the ruling, i.e. the SignedVerdictPage, which has no subsections.
  EXTENSION = 3,
  JUDGE_EXTENSION = 4,
}

export enum ProsecutorSubsections {
  CUSTODY_REQUEST_STEP_ONE = 0,
  CUSTODY_REQUEST_STEP_TWO = 1,
  CUSTODY_REQUEST_STEP_THREE = 2,
  CUSTODY_REQUEST_STEP_FOUR = 3,
  CUSTODY_REQUEST_STEP_FIVE = 4,
  PROSECUTOR_OVERVIEW = 5,
}

export enum JudgeSubsections {
  JUDGE_OVERVIEW = 0,
  HEARING_ARRANGEMENTS = 1,
  COURT_RECORD = 2,
  RULING_STEP_ONE = 3,
  RULING_STEP_TWO = 4,
  CONFIRMATION = 5,
}

export type ReactSelectOption = { label: string; value: string | number }

export enum LoginErrorCodes {
  UNAUTHORIZED = 'innskraning-ekki-notandi',
  UNAUTHENTICATED = 'innskraning-utrunnin',
  LOGIN_FAILED = 'innskraning-ogild',
}

export type directionType = 'ascending' | 'descending'
export interface SortConfig {
  key: keyof Case
  direction: directionType
}

export interface CaseData {
  case?: Case
}

export interface UserData {
  users: User[]
}
