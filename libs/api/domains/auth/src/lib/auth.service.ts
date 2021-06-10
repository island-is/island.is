import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  DelegationDTO,
  DelegationsApi,
  ApiScopeApi,
} from '@island.is/clients/auth-public-api'

import { UpdateDelegationInput, DelegationInput } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private _delegationsApi: DelegationsApi,
    private _apiScopeApi: ApiScopeApi,
  ) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this._delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private apiScopeApiWithAuth(auth: Auth) {
    return this._apiScopeApi.withMiddleware(new AuthMiddleware(auth))
  }

  getActorDelegations(user: User): Promise<Array<DelegationDTO>> {
    return this.delegationsApiWithAuth(user).delegationsControllerFindAllTo()
  }

  getApiScopes(user: User): Promise<any> {
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
    { toNationalId, name }: DelegationInput,
  ): Promise<DelegationDTO> {
    return this.delegationsApiWithAuth(user).delegationsControllerCreate({
      createDelegationDTO: { toNationalId, fromName: name },
    })
  }

  updateDelegation(
    user: User,
    { id, scopes }: UpdateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.delegationsApiWithAuth(user).delegationsControllerUpdate({
      id,
      updateDelegationDTO: {
        scopes: scopes.map((scope) => ({ ...scope, scopeName: scope.name })),
      },
    })
  }
}
