import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  DelegationDTO,
  DelegationsApi,
} from '@island.is/clients/auth-public-api'

@Injectable()
export class AuthService {
  constructor(private _delegationsApi: DelegationsApi) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this._delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getActorDelegations(user: User): Promise<Array<DelegationDTO>> {
    return this.delegationsApiWithAuth(user).delegationsControllerFindAllTo()
  }
}
