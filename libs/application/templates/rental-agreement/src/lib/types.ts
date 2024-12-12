import {
  Application,
  FieldBaseProps,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { RentalAgreement } from './dataSchema'

export interface ExternalData {
  nationalRegistry: {
    data: NationalRegistryIndividual
    date: string
    status: StatusProvider
  }
}

export type StatusProvider = 'failure' | 'success'
