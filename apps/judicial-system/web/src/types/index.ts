import {
  CaseType,
  Institution,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  Case,
  CaseListEntry,
  CreateCase,
  UpdateCase,
} from '@island.is/judicial-system/types'

export enum AppealDecisionRole {
  PROSECUTOR = 'PROSECUTOR',
  ACCUSED = 'ACCUSED',
}

export enum Sections {
  PROSECUTOR = 0,
  JUDGE = 1,
  CASE_CLOSED = 2,
  EXTENSION = 3,
  JUDGE_EXTENSION = 4,
}

export enum RestrictionCaseProsecutorSubsections {
  DEFENDANT = 0,
  HEARING_ARRANGEMENTS = 1,
  POLICE_DEMANDS = 2,
  POLICE_REPORT = 3,
  CASE_FILES = 4,
  PROSECUTOR_OVERVIEW = 5,
}

export enum RestrictionCaseCourtSubsections {
  RECEPTION_AND_ASSIGNMENT = 0,
  JUDGE_OVERVIEW = 1,
  HEARING_ARRANGEMENTS = 2,
  RULING = 3,
  COURT_RECORD = 4,
  CONFIRMATION = 5,
}

export enum IndictmentsProsecutorSubsections {
  DEFENDANT = 0,
  POLICE_CASE_FILES = 1,
  CASE_FILE = 2,
  PROCESSING = 3,
  INDICTMENT = 4,
  CASE_FILES = 4,
  OVERVIEW = 5,
}

export enum IndictmentsCourtSubsections {
  JUDGE_OVERVIEW = 0,
  RECEPTION_AND_ASSIGNMENT = 1,
  SUBPEONA = 2,
  PROSECUTOR_AND_DEFENDER = 3,
  COURT_RECORD = 4,
}

export type ReactSelectOption = {
  label: string
  value: string | number
  __isNew__?: boolean
}

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
  case?: TempCase
}

export interface LimitedAccessCaseData {
  limitedAccessCase?: Case
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

interface NationalRegistryBusiness {
  type: string
  kennitala: string
  full_name: string
  short_name: string
  alt_foreign_name?: string
  is_company: boolean
  business_type: {
    code: string
    name: {
      is: string
      en: string
    }
  }
  business_activity?: string
  parent_company_kennitala?: string
  director: string
  legal_address: {
    street: {
      nominative: string
      dative: string
    }
    postal_code: number
    town: {
      nominative: string
      dative: string
    }
    country: {
      code: string
      name: {
        is: string
        en: string
      }
    }
    municipality: string
    coordinates: {
      longitude: number
      latitude: number
      x_isn93: number
      y_isn93: number
    }
  }
  postal_address: {
    street: {
      nominative: string
      dative: string
    }
    postal_code: number
    town: {
      nominative: string
      dative: string
    }
    country: {
      code: string
      name: {
        is: string
        en: string
      }
    }
    municipality: string
    coordinates: {
      longitude: number
      latitude: number
      x_isn93: number
      y_isn93: number
    }
  }
  international_address?: string
  receiver?: string
  currency: string
  share_capital: number
  remarks?: string
  banned: boolean
}

interface NationalRegistryMeta {
  api_version: number
  first_item: number
  last_item: number
  total_items: number
}

export interface NationalRegistryResponsePerson {
  items?: NationalRegistryPerson[]
  meta?: NationalRegistryMeta
  error?: string
}

export interface NationalRegistryResponseBusiness {
  items?: NationalRegistryBusiness[]
  meta?: NationalRegistryMeta
  error?: string
}

export interface Lawyer {
  name: string
  practice: string
  email: string
  phoneNr: string
  nationalId: string
}

/**
 * We are in the process of stopping using the Case type and
 * using the generated Case type from /graphql/schema.tsx instead.
 * We use this type so that we don't have to migrate all the code
 * at once and this type will be removed when we are done.
 */
export interface TempCase
  extends Omit<
    Case,
    | 'sharedWithProsecutorsOffice'
    | 'court'
    | 'courtDocuments'
    | 'parentCase'
    | 'childCase'
    | 'type'
  > {
  sharedWithProsecutorsOffice?: Institution
  court?: Institution
  courtDocuments?: CourtDocument[]
  parentCase?: TempCase
  childCase?: TempCase
  type: CaseType
}

export interface TempUpdateCase
  extends Omit<
    UpdateCase,
    | 'sharedWithProsecutorsOffice'
    | 'court'
    | 'courtDocuments'
    | 'parentCase'
    | 'type'
  > {
  sharedWithProsecutorsOffice?: Institution
  court?: Institution
  courtDocuments?: CourtDocument[]
  parentCase?: TempCase
  type?: CaseType
}

export interface TempCreateCase extends Omit<CreateCase, 'type'> {
  type: CaseType
}

export interface TempCaseListEntry extends Omit<CaseListEntry, 'type'> {
  type: CaseType
}

export interface CourtDocument {
  name: string
  submittedBy: UserRole
}
