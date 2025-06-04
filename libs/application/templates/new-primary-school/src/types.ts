import { MembershipOrganizationType, MembershipRole } from './lib/constants'

export interface RelativesRow {
  fullName: string
  phoneNumber: string
  nationalId: string
  relation: string
}

export interface SiblingsRow {
  fullName: string
  nationalId: string
}

export type Child = {
  fullName: string
  nationalId: string
  otherParent: object
  livesWithApplicant: boolean
  livesWithBothParents: boolean
  genderCode: string
}

export type ChildInformation = {
  name: string
  nationalId: string
  address: {
    streetAddress: string
    postalCode: string
    city: string
  }
  preferredName: string
  pronouns: string[]
  differentPlaceOfResidence: string
  placeOfResidence?: {
    streetAddress: string
    postalCode: string
  }
  usePronounAndPreferredName?: string[]
}

export type Person = {
  nationalId: string
  fullName: string
  email: string
  phoneNumber: string
  address: {
    streetAddress: string
    streetName?: string
    postalCode: string
    city: string
  }
}

export type SelectOption = {
  label: string
  value: string
}

export type Agent = {
  id: string
  name: string
  role: string
  email: string
  phone: string
  nationalId: string
}

export type Membership = {
  id: string
  role: MembershipRole
  beginDate: Date
  endDate: Date | null
  organization?: MembershipOrganization
}

export type MembershipOrganization = {
  id: string
  nationalId: string
  name: string
  type: MembershipOrganizationType
}

export type AddressModel = {
  id: string
  street: string
  municipality?: string // Is set as object in MMS data
  zip: string
  country?: string // Is set as object in MMS data
}

export type FriggChildInformation = {
  id: string
  name: string
  email: string
  agents: Agent[]
  pronouns: string[]
  nationalId: string
  gradeLevel: string
  memberships: Membership[]
  primaryOrgId: string
  preferredName: string | null
  domicile: AddressModel
  residence: AddressModel
}
