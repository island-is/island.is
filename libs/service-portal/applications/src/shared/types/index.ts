import { Option } from '@island.is/island-ui/core'

export enum ApplicationOverViewStatus {
  incomplete = 'incomplete',
  inProgress = 'inProgress',
  finished = 'finished',
  all = 'all',
}

export type FilterValues = {
  activeInstitution: Option
  searchQuery: string
}
