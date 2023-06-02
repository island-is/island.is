import { NationalRegistryIndividual } from '@island.is/application/types'

export interface CitizenIndividual extends NationalRegistryIndividual {
  residenceInIcelandLastChangeDate?: Date | null
}
