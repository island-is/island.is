import { ApiScope } from '@/index'
import { ApplicationScope } from '../application.scope'

export const formSystemScopes = [
  ApplicationScope.read,
  ApplicationScope.write,
  ApiScope.assets,
  ApiScope.vehicles,
  ApiScope.ships,
]
