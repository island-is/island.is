import { Optional } from 'sequelize'
import {
  ApiScopeGroupDTO,
  ApiScopesDTO,
  ApiScopeUserAccessDTO,
  DelegationDTO,
  DelegationScopeDTO,
  DomainDTO,
} from '@island.is/auth-api-lib'

export type CreateDomain = Partial<DomainDTO> & { apiScopes?: CreateApiScope[] }
export type CreateApiScope = Partial<ApiScopesDTO>
export type CreateApiScopeGroup = Partial<ApiScopeGroupDTO> & {
  id?: string
  apiScopes?: CreateApiScope[]
}
export type CreateApiScopeUserAccess = ApiScopeUserAccessDTO
export type CreateCustomDelegationScope = Optional<
  Pick<DelegationScopeDTO, 'scopeName' | 'validFrom' | 'validTo'>,
  'validFrom' | 'validTo'
>
export type CreateCustomDelegation = Optional<
  Pick<DelegationDTO, 'toNationalId' | 'fromNationalId' | 'fromName'>,
  'toNationalId' | 'fromNationalId' | 'fromName'
> & {
  domainName: string
  scopes?: CreateCustomDelegationScope[]
}
