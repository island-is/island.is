import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  DelegationDTO,
  UpdateDelegationScopeDTO,
  MeDelegationsControllerFindAllDirectionEnum,
  MeDelegationsApi,
  MeDelegationsControllerFindAllValidEnum,
} from '@island.is/clients/auth-public-api'

import {
  UpdateDelegationInput,
  DeleteDelegationInput,
  DelegationInput,
  CreateDelegationInput,
} from './dto'
import { DelegationByOtherUserInput } from './dto/delegationByOtherUser.input'

@Injectable()
export class MeDelegationsService {
  constructor(private delegationsApi: MeDelegationsApi) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this.delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getDelegations(user: User): Promise<DelegationDTO[]> {
    return this.delegationsApiWithAuth(user).meDelegationsControllerFindAll({
      direction: MeDelegationsControllerFindAllDirectionEnum.Outgoing,
      valid: MeDelegationsControllerFindAllValidEnum.IncludeFuture,
    })
  }

  getDelegationById(
    user: User,
    { delegationId }: DelegationInput,
  ): Promise<DelegationDTO> {
    return this.delegationsApiWithAuth(user).meDelegationsControllerFindOne({
      delegationId,
    })
  }

  async getDelegationByOtherUser(
    user: User,
    { toNationalId }: DelegationByOtherUserInput,
  ): Promise<DelegationDTO> {
    const delegations = await this.delegationsApiWithAuth(
      user,
    ).meDelegationsControllerFindAll({
      direction: MeDelegationsControllerFindAllDirectionEnum.Outgoing,
      otherUser: toNationalId,
    })

    return delegations[0]
  }

  createDelegation(
    user: User,
    { toNationalId, scopes }: CreateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.delegationsApiWithAuth(user).meDelegationsControllerCreate({
      createDelegationDTO: { toNationalId, scopes },
    })
  }

  async deleteDelegation(
    user: User,
    { delegationId }: DeleteDelegationInput,
  ): Promise<boolean> {
    await this.delegationsApiWithAuth(user).meDelegationsControllerDelete({
      delegationId,
    })
    return true
  }

  updateDelegation(
    user: User,
    { delegationId, scopes }: UpdateDelegationInput,
  ): Promise<DelegationDTO> {
    const payload = {
      delegationId,
      updateDelegationDTO: {
        scopes: scopes?.map((scope) => ({
          ...scope,
          validTo: scope.validTo ? scope.validTo : undefined,
        })) as UpdateDelegationScopeDTO[],
      },
    }
    return this.delegationsApiWithAuth(user).meDelegationsControllerUpdate(
      payload,
    )
  }
}
