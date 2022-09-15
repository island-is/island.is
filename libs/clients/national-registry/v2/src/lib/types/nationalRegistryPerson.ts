import { Address } from './address'
import { Birthplace } from './birthplace'
import { Citizenship } from './citizenship'
import { Residence } from './residence'
import { Spouse } from './spouse'

export interface NationalRegistryPerson {
  nationalId: string
  fullName: string
  genderCode: string
  age: number
  address?: Address | null
  livesWithApplicant?: boolean
  livesWithBothParents?: boolean
  children?: NationalRegistryPerson[]
  otherParent?: NationalRegistryPerson
  residenceHistory?: Residence[]
  spouse?: Spouse
  birthplace?: Birthplace
  citizenship?: Citizenship
}
