import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  ActorDelegationsControllerFindAllDirectionEnum,
  ActorDelegationsApi,
  DelegationType,
  MergedDelegationDTO,
} from '@island.is/clients/auth/public-api'

@Injectable()
export class ActorDelegationsService {
  constructor(private delegationsApi: ActorDelegationsApi) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this.delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getActorDelegations(
    user: User,
    delegationTypes?: DelegationType[],
  ): Promise<MergedDelegationDTO[]> {
    return this.delegationsApiWithAuth(user).actorDelegationsControllerFindAll({
      direction: ActorDelegationsControllerFindAllDirectionEnum.Incoming,
      delegationTypes,
    })
  }
}
