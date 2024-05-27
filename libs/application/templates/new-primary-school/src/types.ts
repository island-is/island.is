import { RelationOptions } from './lib/constants'

export interface RelativesRow {
  fullName: string
  phoneNumber: string
  nationalId: string
  relation: RelationOptions
  canPickUpChild: string[]
}

export type Child = {
  fullName: string
  nationalId: string
  otherParent: object
  livesWithApplicant: boolean
  domicileInIceland: boolean
  livesWithBothParents: boolean
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
