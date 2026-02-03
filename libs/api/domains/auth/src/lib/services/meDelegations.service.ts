import { Injectable, NotFoundException } from '@nestjs/common'
import differenceWith from 'lodash/differenceWith'
import groupBy from 'lodash/groupBy'
import min from 'lodash/min'
import max from 'lodash/max'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  DelegationDTO,
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
import { DelegationsGroupedByIdentity } from '../dto/delegationsGroupedByIdentity.dto'
import { DelegationScope } from '../models/delegationScope.model'
import startOfDay from 'date-fns/startOfDay'

@Injectable()
export class MeDelegationsService {
  constructor(private delegationsApi: MeDelegationsApi) {}

  private delegationsApiWithAuth(auth: Auth) {
    return this.delegationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getDelegations(
    user: User,
    input: DelegationsInput,
  ): Promise<DelegationDTO[]> {
    const delegations = await this.delegationsApiWithAuth(
      user,
    ).meDelegationsControllerFindAll({
      domain: input.domain ?? undefined,
      direction:
        input.direction ?? MeDelegationsControllerFindAllDirectionEnum.outgoing,
      validity: MeDelegationsControllerFindAllValidityEnum.includeFuture,
    })
    return delegations.map(this.includeDomainNameInScopes)
  }

  async getDelegationById(
    user: User,
    { delegationId }: DelegationInput,
  ): Promise<DelegationDTO | null> {
    const request = await this.delegationsApiWithAuth(
      user,
    ).meDelegationsControllerFindOneRaw({
      delegationId,
    })
    const delegation = request.raw.status === 204 ? null : await request.value()

    return delegation ? this.includeDomainNameInScopes(delegation) : null
  }

  async getDelegationByOtherUser(
    user: User,
    { toNationalId, domain }: DelegationByOtherUserInput,
  ): Promise<DelegationDTO | null> {
    const delegations = await this.delegationsApiWithAuth(
      user,
    ).meDelegationsControllerFindAll({
      direction: MeDelegationsControllerFindAllDirectionEnum.outgoing,
      xQueryOtherUser: toNationalId,
      domain: domain ?? undefined,
    })

    return delegations[0]
      ? this.includeDomainNameInScopes(delegations[0])
      : null
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

    return this.includeDomainNameInScopes(delegation)
  }

  private createDelegation(
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

  // This function is here for backwards compatibility.
  // TODO: Remove when delegation-v1 code is removed.
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

  async patchDelegation(
    user: User,
    {
      delegationId,
      updateScopes = [],
      deleteScopes = [],
    }: PatchDelegationInput,
  ): Promise<DelegationDTO> {
    const delegation = await this.delegationsApiWithAuth(
      user,
    ).meDelegationsControllerPatch({
      delegationId,
      patchDelegationDTO: {
        deleteScopes,
        updateScopes,
      },
    })
    return this.includeDomainNameInScopes(delegation)
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

  private includeDomainNameInScopes(delegation: DelegationDTO): DelegationDTO {
    if (!delegation) {
      return delegation
    }

    const today = startOfDay(new Date())

    return {
      ...delegation,
      scopes: delegation.scopes
        ?.filter((scope) => scope?.validTo && scope.validTo > today)
        .map((scope) => ({
          ...scope,
          domainName: delegation.domainName,
        })),
    }
  }

  async getDelegationsGroupedByIdentity(
    user: User,
    input: {
      direction: MeDelegationsControllerFindAllDirectionEnum
    },
  ): Promise<DelegationsGroupedByIdentity[]> {
    const allDelegations = await this.delegationsApiWithAuth(
      user,
    ).meDelegationsControllerFindAll({
      direction: input.direction,
      validity: MeDelegationsControllerFindAllValidityEnum.includeFuture,
    })

    const isOutgoing =
      input.direction === MeDelegationsControllerFindAllDirectionEnum.outgoing

    const groupedByPersonAndType = groupBy(allDelegations, (delegation) => {
      const nationalId = isOutgoing
        ? delegation.toNationalId
        : delegation.fromNationalId
      return `${nationalId}|${delegation.type}`
    })

    return Object.entries(groupedByPersonAndType).map(([key, delegations]) => {
      const firstDelegation = delegations[0]
      const nationalId = isOutgoing
        ? firstDelegation.toNationalId
        : firstDelegation.fromNationalId
      const personName = isOutgoing
        ? firstDelegation.toName ?? nationalId ?? ''
        : firstDelegation.fromName ?? nationalId ?? ''

      // Flatten all scopes from all domains, adding domain context to each scope
      const allScopes: DelegationScope[] = delegations.flatMap(
        (delegation) =>
          delegation.scopes?.map((scope) => ({
            id: scope.id ?? `${delegation.id}-${scope.scopeName}`,
            name: scope.scopeName ?? '',
            scopeName: scope.scopeName ?? '',
            displayName: scope.displayName ?? scope.scopeName ?? '',
            validFrom: scope.validFrom ?? undefined,
            validTo: scope.validTo ?? undefined,
            domainName: delegation.domainName ?? '',
          })) ?? [],
      )

      // Get earliest and latest dates
      const validFromDates = allScopes
        .map((s) => s.validFrom)
        .filter((d): d is Date => d != null)
      const validToDates = allScopes
        .map((s) => s.validTo)
        .filter((d): d is Date => d != null)

      return {
        nationalId: nationalId ?? '',
        name: personName,
        type: firstDelegation.type,
        totalScopeCount: allScopes.length,
        scopes: allScopes,
        earliestValidFrom:
          validFromDates.length > 0 ? min(validFromDates) : null,
        latestValidTo: validToDates.length > 0 ? max(validToDates) : null,
      }
    })
  }
}
