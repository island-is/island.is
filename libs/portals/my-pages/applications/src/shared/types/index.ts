import { InstitutionTypes } from '@island.is/application/types'
import { Option } from '@island.is/island-ui/core'

export enum ApplicationOverViewStatus {
  incomplete = 'draft',
  inProgress = 'inprogress',
  completed = 'completed',
  rejected = 'rejected',
  approved = 'approved',
  all = 'all',
}

export type FilterValues = {
  activeInstitution: InstitutionOption
  searchQuery: string
}

export type InstitutionOption = Option<InstitutionTypes | ''>
