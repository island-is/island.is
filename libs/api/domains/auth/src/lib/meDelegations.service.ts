import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  DelegationDTO,
  MeDelegationsApi,
  MeDelegationsControllerFindAllDirectionEnum,
  MeDelegationsControllerFindAllValidityEnum,
} from '@island.is/clients/auth-public-api'

import {
  CreateDelegationInput,
  DelegationInput,
  DeleteDelegationInput,
  UpdateDelegationInput,
} from './dto'
import { DelegationByOtherUserInput } from './dto/delegationByOtherUser.input'

const ignore404 = (e: Response) => {
  if (e.status !== 404) {
    throw e
  }
}

@Injectable()
export class MeDelegationsService {
  constructor(private delegationsApi: MeDelegationsApi) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this.delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getDelegations(user: User): Promise<DelegationDTO[]> {
    return this.delegationsApiWithAuth(user).meDelegationsControllerFindAll({
      direction: MeDelegationsControllerFindAllDirectionEnum.Outgoing,
      validity: MeDelegationsControllerFindAllValidityEnum.IncludeFuture,
    })
  }

  async getDelegationById(
    user: User,
    { delegationId }: DelegationInput,
  ): Promise<DelegationDTO | null> {
    const delegation = await this.delegationsApiWithAuth(user)
      .meDelegationsControllerFindOne({ delegationId })
      .catch(ignore404)

    if (!delegation) {
      return null
    }

    return delegation
  }

  async getDelegationByOtherUser(
    user: User,
    { toNationalId }: DelegationByOtherUserInput,
  ): Promise<DelegationDTO | null> {
    const delegations = await this.delegationsApiWithAuth(
      user,
    ).meDelegationsControllerFindAll({
      direction: MeDelegationsControllerFindAllDirectionEnum.Outgoing,
      otherUser: toNationalId,
    })

    return delegations[0] ?? null
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
    return this.delegationsApiWithAuth(user).meDelegationsControllerUpdate({
      delegationId,
      updateDelegationDTO: {
        scopes,
      },
    })
  }
}
