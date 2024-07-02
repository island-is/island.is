import {
  Gender,
  MembershipOrganizationType,
  MembershipRole,
  RelationOptions,
  SiblingRelationOptions,
} from './lib/constants'

export interface RelativesRow {
  fullName: string
  phoneNumber: string
  nationalId: string
  relation: RelationOptions
  canPickUpChild: string[]
}

export interface SiblingsRow {
  fullName: string
  nationalId: string
  relation: SiblingRelationOptions
}

export type Child = {
  fullName: string
  nationalId: string
  otherParent: object
  livesWithApplicant: boolean
  domicileInIceland: boolean
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
  gender: Gender
  preferredName: string
  pronouns: string[]
  differentPlaceOfResidence: string
  placeOfResidence?: {
    streetAddress: string
    postalCode: string
  }
}

export type Person = {
  nationalId: string
  fullName: string
  email: string
  phoneNumber: string
  address: {
    streetAddress: string
    postalCode: string
    city: string
  }
}

export type Parents = {
  parent1: Person
  parent2: Person
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

export type FriggChildInformation = {
  id: string
  name: string
  email: string
  agents: Agent[]
  pronouns: string[]
  nationalId: string
  gradeLevels: string[]
  memberships: Membership[]
  primaryOrgId: object
  preferredName: object | null
  address?: {
    id: string
    street: string
    municipality?: object
    zip: string
    country?: object
  }
}
