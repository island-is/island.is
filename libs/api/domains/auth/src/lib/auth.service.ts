import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  DelegationDTO,
  UpdateDelegationScopeDTO,
  DelegationsApi,
  ApiScopeApi,
  ApiScope,
} from '@island.is/clients/auth-public-api'

import {
  UpdateDelegationInput,
  DeleteDelegationInput,
  DelegationInput,
  CreateDelegationInput,
} from './dto'

@Injectable()
export class AuthService {
  constructor(
    private delegationsApi: DelegationsApi,
    private apiScopeApi: ApiScopeApi,
  ) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this.delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private apiScopeApiWithAuth(auth: Auth) {
    return this.apiScopeApi.withMiddleware(new AuthMiddleware(auth))
  }

  getActorDelegations(user: User): Promise<DelegationDTO[]> {
    return this.delegationsApiWithAuth(user).delegationsControllerFindAllTo()
  }

  getDelegations(user: User): Promise<DelegationDTO[]> {
    return this.delegationsApiWithAuth(
      user,
    ).delegationsControllerFindAllCustomFrom({ isValid: 'true' })
  }

  getApiScopes(user: User): Promise<ApiScope[]> {
    return this.apiScopeApiWithAuth(
      user,
    ).apiScopeControllerFindAllWithExplicitDelegationGrant()
  }

  getDelegationFromNationalId(
    user: User,
    { toNationalId }: DelegationInput,
  ): Promise<DelegationDTO> {
    return this.delegationsApiWithAuth(user).delegationsControllerFindOneTo({
      nationalId: toNationalId,
    })
  }

  createDelegation(
    user: User,
    { toNationalId, name }: CreateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.delegationsApiWithAuth(user).delegationsControllerCreate({
      createDelegationDTO: { toNationalId, toName: name },
    })
  }

  async deleteDelegation(
    user: User,
    { toNationalId }: DeleteDelegationInput,
  ): Promise<boolean> {
    await this.delegationsApiWithAuth(user).delegationsControllerDeleteTo({
      toNationalId,
    })
    return true
  }

  updateDelegation(
    user: User,
    { toNationalId, scopes }: UpdateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.delegationsApiWithAuth(user).delegationsControllerUpdate({
      toNationalId,
      updateDelegationDTO: {
        scopes: scopes?.map((scope) => ({
          ...scope,
          validTo: scope.validTo ? scope.validTo : undefined,
        })) as UpdateDelegationScopeDTO[],
      },
    })
  }
}
