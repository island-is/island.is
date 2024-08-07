import {
  Gender,
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
  chosenName: string
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
