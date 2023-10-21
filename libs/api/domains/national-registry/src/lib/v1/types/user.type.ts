import { Gender, MaritalStatus } from '../../shared/types'

export interface User {
  nationalId: string
  name: string
  firstName: string
  middleName: string
  lastName: string
  fullName: string
  gender: Gender
  maritalStatus: MaritalStatus
  religion: string
  familyNr: string
  banMarking: {
    banMarked: boolean
    startDate: string
  }
  citizenship: {
    code: string
    name: string
  }
  address: {
    code: string
    lastUpdated: string
    streetAddress: string
    city: string
    postalCode: string
  }
  birthPlace: {
    code: string
    city: string
    date: string
  }
  spouse?: {
    name?: string
    nationalId?: string
    cohabitant?: string
  }
}
