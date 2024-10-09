import { Address } from './address'
import { NationalRegistryBirthplace } from './birthplace'

export interface NationalRegistrySpouse {
  name: string
  nationalId: string
  maritalStatus: string
  /** @deprecated */
  // lastModified?: Date | null // Removed in v3
  birthplace?: NationalRegistryBirthplace | null
  citizenship?: {
    code: string | null
    name: string | null
  } | null
  address?: Address | null
}
