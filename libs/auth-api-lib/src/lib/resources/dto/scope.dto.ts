import { ApiScopeGroup } from '../models/api-scope-group.model'

export class ScopeDTO {
  name!: string

  displayName!: string

  group?: ApiScopeGroup

  description!: string

  domainName!: string

  order!: number
}
