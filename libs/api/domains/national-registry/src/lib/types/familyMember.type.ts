import { FamilyRelation } from './familyRelation.enum'
import { Gender } from './gender.enum'
import { MartialStatus } from './maritalStatus.enum'

export interface FamilyMember {
  nationalId: string
  fullName: string
  gender: Gender
  maritalStatus: MartialStatus
  address: string
  familyRelation: FamilyRelation
}
