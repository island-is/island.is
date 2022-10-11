import { ApiScope } from './api-scope.model'

export class ApiScopeGroup {
  id!: string
  name!: string
  displayName!: string
  description!: string
  order!: number
  scopes?: ApiScope[]
  created!: Date
  modified?: Date
}
