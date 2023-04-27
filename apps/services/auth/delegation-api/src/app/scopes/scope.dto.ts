import { ScopeGroupDTO } from './scope-group.dto'

export class ScopeDTO {
  name!: string

  displayName!: string

  group?: ScopeGroupDTO

  description?: string

  domainName!: string

  order!: number
}
