import type { Case, User } from '@island.is/judicial-system/types'

export enum AppealDecisionRole {
  PROSECUTOR = 'PROSECUTOR',
  ACCUSED = 'ACCUSED',
}

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
export type sortableTableColumn = 'defendant' | 'createdAt'

export interface SortConfig {
  column: sortableTableColumn
  direction: directionType
}

export interface CaseData {
  case?: Case
}

export interface UserData {
  users: User[]
}

interface NationalRegistryPerson {
  age: number
  age_year_end: number
  banned: boolean
  family_kennitala: string
  gender: string
  kennitala: string
  legal_residence: {
    code: string
    municipality: string
    country: {
      code: string
      country: {
        code: string
        name: {
          en: string
          is: string
        }
      }
      type: string
      municipality: string
    }
  }
  marital_status: {
    type: string
    code: string
    description: {
      en: string
      is: string
    }
  }
  name: string
  partner_kennitala: string
  permanent_address: {
    street?: { dative: string; nominative: string }
    postal_code?: number
    town?: { dative: string; nominative: string }
    country: { code: string; name: { en: string; is: string }; type: string }
    municipality: string
  }
  proxy_kennitala: string
  see_also: { search: string }
  type: string
}

interface NationalRegistryMeta {
  api_version: number
  first_item: number
  last_item: number
  total_items: number
}

export interface NationalRegistryResponse {
  items: NationalRegistryPerson[]
  meta: NationalRegistryMeta
}
