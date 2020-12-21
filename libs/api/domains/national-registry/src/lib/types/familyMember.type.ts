import { FamilyRelation } from './familyRelation.enum'
import { Gender } from './gender.enum'

export interface FamilyMember {
  nationalId: string
  fullName: string
  gender: Gender
  familyRelation: FamilyRelation
}
