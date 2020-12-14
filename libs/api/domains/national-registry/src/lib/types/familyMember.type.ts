import { FamilyRelation } from './familyRelation.enum'
import { Gender } from './gender.enum'
import { MaritalStatus } from './maritalStatus.enum'

export interface FamilyMember {
  nationalId: string
  fullName: string
  gender: Gender
  maritalStatus: MaritalStatus
  address: string
  familyRelation: FamilyRelation
}
