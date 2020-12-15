import { FamilyRelation } from './familyRelation.enum'
import { Gender, MaritalStatus } from '../types'

export interface FamilyMember {
  nationalId: string
  fullName: string
  gender: Gender
  maritalStatus: MaritalStatus
  address: string
  familyRelation: FamilyRelation
}
