import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import uniqBy from 'lodash/uniqBy'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  MeDelegationsApi,
  MeDelegationsControllerFindAllDirectionEnum,
  MeDelegationsControllerFindAllValidityEnum,
} from '@island.is/clients/auth/public-api'

import {
  CreateDelegationInput,
  DelegationInput,
  DeleteDelegationInput,
  UpdateDelegationInput,
  PatchDelegationInput,
  DelegationsInput,
} from '../dto'
import { DelegationByOtherUserInput } from '../dto/delegationByOtherUser.input'
import { DelegationScopeInput } from '../dto/delegationScope.input'
import { MeDelegationsServiceInterface, DelegationDTO } from '../services/types'
import { ISLAND_DOMAIN } from './constants'

const ignore404 = (e: Response) => {
  if (e.status !== 404) {
    throw e
  }
}

@Injectable()
export class MeDelegationsServiceV1 implements MeDelegationsServiceInterface {
  constructor(private delegationsApi: MeDelegationsApi) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this.delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getDelegations(
    user: User,
    input: DelegationsInput,
  ): Promise<DelegationDTO[]> {
    this.checkDomain(input.domain)

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

  async createOrUpdateDelegation(
    user: User,
    input: CreateDelegationInput,
  ): Promise<DelegationDTO> {
    let delegation = await this.getDelegationByOtherUser(user, input)
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
    { toNationalId, scopes, domainName }: CreateDelegationInput,
  ): Promise<DelegationDTO> {
    this.checkDomain(domainName)

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

  async patchDelegation(
    user: User,
    {
      delegationId,
      updateScopes = [],
      deleteScopes = [],
    }: PatchDelegationInput,
  ): Promise<DelegationDTO> {
    const delegation = await this.getDelegationById(user, { delegationId })
    if (!delegation) {
      throw new NotFoundException()
    }
    const existingScopes = delegation.scopes ?? []

    // Map existing scopes to DTO.
    let scopes = existingScopes
      .map((scope) => ({
        name: scope.scopeName,
        validTo: scope.validTo,
      }))
      .filter((scope): scope is DelegationScopeInput => Boolean(scope.validTo))

    // Override scopes (first occurrence wins).
    scopes = uniqBy([...updateScopes, ...scopes], 'name')

    // Remove deleted scopes.
    scopes = scopes.filter((scope) => deleteScopes.includes(scope.name))

    return this.updateDelegation(user, {
      delegationId,
      scopes,
    })
  }

  private checkDomain(domain?: string | null) {
    if ((domain ?? ISLAND_DOMAIN) !== ISLAND_DOMAIN) {
      throw new BadRequestException(`Can only specify ${ISLAND_DOMAIN} domain`)
    }
  }
}
