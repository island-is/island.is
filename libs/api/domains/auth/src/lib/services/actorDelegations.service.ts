import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  DelegationDTO,
  ActorDelegationsControllerFindAllDirectionEnum,
  ActorDelegationsApi,
  DelegationType,
} from '@island.is/clients/auth-public-api'

@Injectable()
export class ActorDelegationsService {
  constructor(private delegationsApi: ActorDelegationsApi) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this.delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getActorDelegations(
    user: User,
    delegationTypes?: DelegationType[],
  ): Promise<DelegationDTO[]> {
    return this.delegationsApiWithAuth(user).actorDelegationsControllerFindAll({
      direction: ActorDelegationsControllerFindAllDirectionEnum.Incoming,
      delegationTypes,
    })
  }
}
