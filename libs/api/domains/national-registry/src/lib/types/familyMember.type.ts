import { FamilyRelation } from './familyRelation.enum'

export interface FamilyMember {
  nationalId: string
  fullName: string
  gender: string
  maritalStatus: string
  address: string
  familyRelation: FamilyRelation
}
