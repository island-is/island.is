import {
  Case,
  CaseListEntry,
  CreateCase,
  SubstanceMap,
  UpdateCase,
} from '@island.is/judicial-system/types'
import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseCustodyRestrictions,
  CaseLegalProvisions,
  CaseOrigin,
  CaseType,
  Defendant,
  IndictmentCount,
  Institution,
  RequestSharedWithDefender,
  SessionArrangements,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

export enum AppealDecisionRole {
  PROSECUTOR = 'PROSECUTOR',
  ACCUSED = 'ACCUSED',
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
export type sortableTableColumn = 'defendant' | 'createdAt' | 'courtDate'

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

export interface TempIndictmentCount
  extends Omit<IndictmentCount, 'substances'> {
  substances?: SubstanceMap
}

export interface TempCase
  extends Omit<
    Case,
    | 'origin'
    | 'sharedWithProsecutorsOffice'
    | 'court'
    | 'courtDocuments'
    | 'parentCase'
    | 'childCase'
    | 'type'
    | 'indictmentCounts'
    | 'sessionArrangements'
    | 'appealState'
    | 'appealedByRole'
    | 'appealRulingDecision'
    | 'defendants'
    | 'requestedCustodyRestrictions'
    | 'legalProvisions'
    | 'accusedAppealDecision'
    | 'prosecutorAppealDecision'
    | 'requestSharedWithDefender'
  > {
  origin: CaseOrigin
  sharedWithProsecutorsOffice?: Institution
  court?: Institution
  courtDocuments?: CourtDocument[]
  parentCase?: TempCase
  childCase?: TempCase
  type: CaseType
  indictmentCounts?: TempIndictmentCount[]
  sessionArrangements?: SessionArrangements
  appealState?: CaseAppealState
  appealedByRole?: UserRole
  appealRulingDecision?: CaseAppealRulingDecision
  defendants?: Defendant[]
  requestedCustodyRestrictions?: CaseCustodyRestrictions[]
  legalProvisions?: CaseLegalProvisions[]
  accusedAppealDecision?: CaseAppealDecision
  prosecutorAppealDecision?: CaseAppealDecision
  requestSharedWithDefender?: RequestSharedWithDefender | null
}

export interface TempUpdateCase
  extends Omit<
    UpdateCase,
    | 'courtDocuments'
    | 'type'
    | 'sessionArrangements'
    | 'appealState'
    | 'appealRulingDecision'
    | 'defendants'
    | 'requestSharedWithDefender'
  > {
  courtDocuments?: CourtDocument[]
  type?: CaseType
  sessionArrangements?: SessionArrangements
  appealState?: CaseAppealState
  appealRulingDecision?: CaseAppealRulingDecision
  defendants?: Defendant[]
  requestSharedWithDefender?: RequestSharedWithDefender | null
}

export interface TempCreateCase
  extends Omit<CreateCase, 'type' | 'requestSharedWithDefender'> {
  type: CaseType
  requestSharedWithDefender?: RequestSharedWithDefender | null
}

export interface TempCaseListEntry
  extends Omit<
    CaseListEntry,
    'type' | 'appealState' | 'appealCaseNumber' | 'appealRulingDecision'
  > {
  type: CaseType
  appealState?: CaseAppealState
  appealCaseNumber?: string
  appealRulingDecision?: CaseAppealRulingDecision
}

export interface CourtDocument {
  name: string
  submittedBy: UserRole
}
