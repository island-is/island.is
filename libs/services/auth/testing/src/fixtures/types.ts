import { Optional } from 'sequelize'

import {
  ApiScopesDTO,
  ApiScopeUserAccessDTO,
  DelegationDTO,
  DelegationScopeDTO,
  IdentityResource,
} from '@island.is/auth-api-lib'

export type CreateIdentityResource = Partial<IdentityResource>
export type CreateApiScope = Partial<ApiScopesDTO>
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
