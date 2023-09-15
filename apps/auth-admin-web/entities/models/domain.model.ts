import { ApiScopeGroup } from './api-scope-group.model'

export class Domain {
  name!: string
  description!: string
  nationalId!: string
  displayName!: string
  organisationLogoKey!: string
  created!: Date
  modified?: Date
  groups?: ApiScopeGroup[]
}
