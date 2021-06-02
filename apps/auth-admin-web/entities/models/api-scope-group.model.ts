import { ApiScope } from './api-scope.model'

export class ApiScopeGroup {
  id!: string
  name!: string
  description!: string
  domainName!: string
  scopes?: ApiScope[]
  created!: Date
  modified?: Date
}
