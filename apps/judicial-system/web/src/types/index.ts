import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

export type ReactSelectOption = {
  label: string
  value: string | number | null
  __isNew__?: boolean
}

export enum LoginErrorCodes {
  UNAUTHORIZED = 'innskraning-ekki-notandi',
  UNAUTHENTICATED = 'innskraning-utrunnin',
  LOGIN_FAILED = 'innskraning-ogild',
  DEPRECATED_LOGIN = 'innskraning-gomul',
  INVALID_USER = 'innskraning-ogildur-notandi',
  LOGIN_ERROR = 'innskraning-villa',
}

export type directionType = 'ascending' | 'descending'
export type sortableTableColumn = keyof CaseListEntry
export type sortableFn = 'number'

export interface SortConfig {
  column: sortableTableColumn
  direction: directionType
  sortFn?: sortableFn
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
