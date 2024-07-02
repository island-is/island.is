import { Gender, MaritalStatus } from '../../shared/types'

export interface User {
  nationalId: string
  name: string
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  fullName: string
  gender: Gender
  maritalStatus: MaritalStatus
  religion?: string | null
  familyNr?: string | null
  legalResidence?: string | null
  banMarking: {
    banMarked: boolean
    startDate?: string
  }
  citizenship?: {
    code: string
    name: string
  } | null
  address?: {
    code?: string | null
    lastUpdated?: string | null
    streetAddress?: string | null
    city: string
    postalCode?: string | null
  } | null
  birthPlace: {
    code?: string | null
    city?: string | null
    date?: string | null
  }
  spouse?: {
    name?: string | null
    nationalId?: string | null
    cohabitant?: string | null
  } | null
}
