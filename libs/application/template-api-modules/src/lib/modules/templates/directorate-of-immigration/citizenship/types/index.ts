import {
  NationalRegistryBirthplace,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
} from '@island.is/application/types'

export interface CitizenIndividual extends NationalRegistryIndividual {
  residenceLastChangeDate?: Date | null
}

export interface SpouseIndividual extends NationalRegistrySpouse {
  spouse?: CitizenIndividual | null
  spouseBirthplace?: NationalRegistryBirthplace | null
  lastModified?: Date | null
}
