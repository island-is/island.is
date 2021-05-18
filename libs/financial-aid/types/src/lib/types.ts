export interface Application {
  id: string
  created: string
  modified: string
  nationalId: string
  name: string
  phoneNumber: string
  email: string
}

export interface CreateApplication {
  nationalId: string
  name: string
  phoneNumber: string
  email: string
}

export interface Municipality {
  id: string
  // created: string
  // modified: string
  name: string
  settings: MunicipalitySettings
}

export interface MunicipalitySettings {
  aid: {
    ownApartmentOrLease: number
    withOthersOrUnknow: number
    withParents: number
  }
}

export interface NavigationProps {
  activeSectionIndex: number
  activeSubSectionIndex?: number
  prevUrl: string | undefined
  nextUrl: string | undefined
}

export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }

export type HomeCircumstances =
  | 'Unknown'
  | 'WithParents'
  | 'WithOthers'
  | 'OwnPlace'
  | 'RegisteredLease'
  | 'Other'

// OwnPlace = 'OwnPlace',

// NEW = 'NEW',
// DRAFT = 'DRAFT',
// SUBMITTED = 'SUBMITTED',
// RECEIVED = 'RECEIVED',
// ACCEPTED = 'ACCEPTED',
// REJECTED = 'REJECTED',
// DELETED = 'DELETED',
