import { Address } from './address'

export interface FamilyMemberInfo {
  nationalId: string
  fullName: string
  genderCode: string
  address?: Address | null
}
