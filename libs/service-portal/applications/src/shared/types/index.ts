import { InstitutionOption } from '@island.is/application/types'

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
