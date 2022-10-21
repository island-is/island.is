import { Injectable, NotFoundException } from '@nestjs/common'
import differenceWith from 'lodash/differenceWith'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  MeDelegationsApi,
  MeDelegationsControllerFindAllDirectionEnum,
  MeDelegationsControllerFindAllValidityEnum,
} from '@island.is/clients/auth/delegation-api'

import {
  CreateDelegationInput,
  DelegationInput,
  DelegationsInput,
  DeleteDelegationInput,
  PatchDelegationInput,
  UpdateDelegationInput,
} from '../dto'
import { DelegationByOtherUserInput } from '../dto/delegationByOtherUser.input'
import { DelegationDTO, MeDelegationsServiceInterface } from '../services/types'

@Injectable()
export class MeDelegationsServiceV2 implements MeDelegationsServiceInterface {
  constructor(private delegationsApi: MeDelegationsApi) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this.delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getDelegations(
    user: User,
    input: DelegationsInput,
  ): Promise<DelegationDTO[]> {
    return this.delegationsApiWithAuth(user).meDelegationsControllerFindAll({
      domain: input.domain,
      direction: MeDelegationsControllerFindAllDirectionEnum.Outgoing,
      validity: MeDelegationsControllerFindAllValidityEnum.IncludeFuture,
    })
  }

  getDelegationById(
    user: User,
    { delegationId }: DelegationInput,
  ): Promise<DelegationDTO | null> {
    return this.delegationsApiWithAuth(user).meDelegationsControllerFindOne({
      delegationId,
    })
  }

  async getDelegationByOtherUser(
    user: User,
    { toNationalId, domain }: DelegationByOtherUserInput,
  ): Promise<DelegationDTO | null> {
    const delegations = await this.delegationsApiWithAuth(
      user,
    ).meDelegationsControllerFindAll({
      direction: MeDelegationsControllerFindAllDirectionEnum.Outgoing,
      xQUERYOTHERUSER: toNationalId,
      domain,
    })

    return delegations[0] ?? null
  }

  async createOrUpdateDelegation(
    user: User,
    input: CreateDelegationInput,
  ): Promise<DelegationDTO> {
    let delegation = await this.getDelegationByOtherUser(user, {
      toNationalId: input.toNationalId,
      domain: input.domainName,
    })
    if (!delegation) {
      delegation = await this.createDelegation(user, input)
    } else if (input.scopes && delegation.id) {
      delegation = await this.updateDelegation(user, {
        delegationId: delegation.id,
        scopes: input.scopes,
      })
    }

    return delegation
  }

  createDelegation(
    user: User,
    { toNationalId, domainName, scopes }: CreateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.delegationsApiWithAuth(user).meDelegationsControllerCreate({
      createDelegationDTO: {
        toNationalId,
        domainName,
        scopes,
      },
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

  async updateDelegation(
    user: User,
    { delegationId, scopes: newScopes = [] }: UpdateDelegationInput,
  ): Promise<DelegationDTO> {
    const delegation = await this.getDelegationById(user, { delegationId })
    if (!delegation) {
      throw new NotFoundException()
    }
    const oldScopes =
      delegation.scopes?.map((scope) => ({
        name: scope.scopeName,
        validTo: scope.validTo,
      })) ?? []

    const updateScopes = differenceWith(
      newScopes,
      oldScopes,
      this.compareScopesByNameAndValidity,
    )
    const deleteScopes = differenceWith(
      oldScopes,
      newScopes,
      this.compareScopesByName,
    ).map((s) => s.name)

    return this.patchDelegation(user, {
      delegationId,
      updateScopes,
      deleteScopes,
    })
  }

  patchDelegation(
    user: User,
    {
      delegationId,
      updateScopes = [],
      deleteScopes = [],
    }: PatchDelegationInput,
  ): Promise<DelegationDTO> {
    return this.delegationsApiWithAuth(user).meDelegationsControllerPatch({
      delegationId,
      patchDelegationDTO: {
        deleteScopes,
        updateScopes,
      },
    })
  }

  private compareScopesByName(
    scopeA: { name: string },
    scopeB: { name: string },
  ): boolean {
    return scopeA.name === scopeB.name
  }

  private compareScopesByNameAndValidity(
    scopeA: { name: string; validTo: Date },
    scopeB: { name: string; validTo?: Date | null },
  ): boolean {
    return scopeA.name === scopeB.name && scopeA.validTo === scopeB.validTo
  }
}
