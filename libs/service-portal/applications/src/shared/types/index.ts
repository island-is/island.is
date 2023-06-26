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
  activeInstitution: Option
  searchQuery: string
}
