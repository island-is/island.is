import { Optional } from 'sequelize'

import {
  ApiScopeDTO,
  ApiScopeUserAccessDTO,
  ClientClaim,
  ClientGrantType,
  DelegationDTO,
  DelegationScopeDTO,
  IdentityResource,
} from '@island.is/auth-api-lib'

export type CreateClientClaim = Optional<
  Pick<ClientClaim, 'clientId' | 'type' | 'value'>,
  'type' | 'value'
>

export type CreateClientGrantType = Optional<
  Pick<ClientGrantType, 'clientId' | 'grantType'>,
  'grantType'
>
export type CreateClientUri = { clientId: string; uri?: string }
export type CreateIdentityResource = Partial<IdentityResource>
export type CreateApiScope = Partial<ApiScopeDTO>
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
