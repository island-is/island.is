import { NationalRegistryIndividual } from '@island.is/application/types'

export interface ExternalData {
  nationalRegistry: {
    data: NationalRegistryIndividual
    date: string
    status: StatusProvider
  }
}

export type StatusProvider = 'failure' | 'success'
