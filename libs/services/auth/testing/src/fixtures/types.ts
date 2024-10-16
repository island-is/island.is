import { Optional } from 'sequelize'

import {
  ApiScopeDTO,
  ApiScopeUserAccessDTO,
  Claim,
  ClientClaim,
  ClientGrantType,
  DelegationDTO,
  DelegationIndex,
  DelegationProviderModel,
  DelegationScopeDTO,
  DelegationTypeModel,
  IdentityResource,
  PersonalRepresentativeRightTypeDTO,
  PersonalRepresentativeTypeDTO,
  UserIdentity,
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
  Pick<
    DelegationDTO,
    'toNationalId' | 'fromNationalId' | 'fromName' | 'referenceId'
  >,
  'toNationalId' | 'fromNationalId' | 'fromName' | 'referenceId'
> & {
  domainName: string
  scopes?: CreateCustomDelegationScope[]
}

export type CreatePersonalRepresentativeType = Optional<
  Pick<PersonalRepresentativeTypeDTO, 'validTo' | 'name' | 'description'>,
  'validTo' | 'name' | 'description'
> & {
  code: string
}

export type CreatePersonalRepresentativeRightType = Optional<
  Pick<
    PersonalRepresentativeRightTypeDTO,
    'validFrom' | 'validTo' | 'description' | 'code'
  >,
  'validFrom' | 'validTo' | 'description' | 'code'
>

export type CreatePersonalRepresentativeDelegation = Optional<
  Pick<
    DelegationDTO,
    'toNationalId' | 'fromNationalId' | 'fromName' | 'validTo'
  >,
  'toNationalId' | 'fromNationalId' | 'fromName' | 'validTo'
> & {
  type?: CreatePersonalRepresentativeType
  rightTypes?: CreatePersonalRepresentativeRightType[]
}

export type CreateDelegationIndexRecord = Optional<
  Pick<
    DelegationIndex,
    | 'fromNationalId'
    | 'toNationalId'
    | 'provider'
    | 'type'
    | 'validTo'
    | 'customDelegationScopes'
    | 'subjectId'
  >,
  | 'fromNationalId'
  | 'toNationalId'
  | 'provider'
  | 'type'
  | 'validTo'
  | 'customDelegationScopes'
  | 'subjectId'
>

export type CreatePersonalRepresentativeScopePermission = {
  rightTypeCode: string
  apiScopeName: string
}

export type CreateUserIdentity = Optional<
  Pick<
    UserIdentity,
    'providerName' | 'providerSubjectId' | 'subjectId' | 'active' | 'name'
  >,
  'providerName' | 'providerSubjectId' | 'subjectId' | 'active' | 'name'
>

export type CreateClaim = Optional<
  Pick<
    Claim,
    'subjectId' | 'type' | 'valueType' | 'value' | 'issuer' | 'originalIssuer'
  >,
  'subjectId' | 'type' | 'valueType' | 'value' | 'issuer' | 'originalIssuer'
>

export type CreateDelegationProvider = Optional<
  Pick<DelegationProviderModel, 'id' | 'name' | 'description'>,
  'id' | 'name' | 'description'
>

export type CreateDelegationType = Optional<
  Pick<DelegationTypeModel, 'id' | 'name' | 'description' | 'providerId'>,
  'id' | 'name' | 'description' | 'providerId'
>
