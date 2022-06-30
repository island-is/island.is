import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import * as kennitala from 'kennitala'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import {
  Identity,
  IdentityService,
  IdentityType,
} from '@island.is/api/domains/identity'
import type { DelegationDTO } from '@island.is/clients/auth-public-api'

import {
  CreateDelegationInput,
  DelegationInput,
  DeleteDelegationInput,
  UpdateDelegationInput,
} from '../dto'
import { Delegation } from '../models'
import { MeDelegationsService } from '../meDelegations.service'
import { ActorDelegationsService } from '../actorDelegations.service'
import { ActorDelegationInput } from '../dto/actorDelegation.input'

@UseGuards(IdsUserGuard)
@Resolver(() => Delegation)
export class DelegationResolver {
  constructor(
    private meDelegationsService: MeDelegationsService,
    private actorDelegationsService: ActorDelegationsService,
    private identityService: IdentityService,
  ) {}

  @Query(() => [Delegation], { name: 'authActorDelegations' })
  getActorDelegations(
    @CurrentUser() user: User,
    @Args('input', { type: () => ActorDelegationInput, nullable: true })
    input?: ActorDelegationInput,
  ): Promise<DelegationDTO[]> {
    return this.actorDelegationsService.getActorDelegations(
      user,
      input?.delegationTypes,
    )
  }

  @Query(() => [Delegation], { name: 'authDelegations' })
  getDelegations(@CurrentUser() user: User): Promise<DelegationDTO[]> {
    return this.meDelegationsService.getDelegations(user)
  }

  @Query(() => Delegation, { name: 'authDelegation', nullable: true })
  async getDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationInput }) input: DelegationInput,
  ): Promise<DelegationDTO | null> {
    return this.meDelegationsService.getDelegationById(user, input)
  }

  @Mutation(() => Delegation, { name: 'createAuthDelegation' })
  async createDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateDelegationInput })
    input: CreateDelegationInput,
  ): Promise<DelegationDTO | null> {
    let delegation = await this.meDelegationsService.getDelegationByOtherUser(
      user,
      input,
    )
    if (!delegation) {
      delegation = await this.meDelegationsService.createDelegation(user, input)
    } else if (input.scopes && delegation.id) {
      delegation = await this.meDelegationsService.updateDelegation(user, {
        delegationId: delegation.id,
        scopes: input.scopes,
      })
    }

    return delegation
  }

  @Mutation(() => Delegation, { name: 'updateAuthDelegation' })
  updateDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateDelegationInput })
    input: UpdateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.meDelegationsService.updateDelegation(user, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAuthDelegation' })
  deleteDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeleteDelegationInput })
    input: DeleteDelegationInput,
  ): Promise<boolean> {
    return this.meDelegationsService.deleteDelegation(user, input)
  }

  @ResolveField('to', () => Identity, { nullable: true })
  async resolveTo(
    @Parent() delegation: DelegationDTO,
    @CurrentUser() user: User,
  ): Promise<Identity> {
    const identity = await this.identityService.getIdentity(
      delegation.toNationalId,
      user,
    )
    return (
      identity ??
      DelegationResolver.fallbackIdentity(
        delegation.toNationalId,
        delegation.toName,
      )
    )
  }

  @ResolveField('from', () => Identity)
  async resolveFrom(
    @Parent() delegation: DelegationDTO,
    @CurrentUser() user: User,
  ): Promise<Identity> {
    const identity = await this.identityService.getIdentity(
      delegation.fromNationalId,
      user,
    )
    return (
      identity ??
      DelegationResolver.fallbackIdentity(
        delegation.fromNationalId,
        delegation.fromName,
      )
    )
  }

  private static fallbackIdentity(
    nationalId: string,
    name?: string | null,
  ): Identity {
    return {
      nationalId: nationalId,
      name: name ?? kennitala.format(nationalId),
      type: kennitala.isCompany(nationalId)
        ? IdentityType.Company
        : IdentityType.Person,
    }
  }

  @ResolveField('validTo', () => Date, { nullable: true })
  resolveValidTo(@Parent() delegation: DelegationDTO): Date | undefined {
    if (!delegation.validTo) {
      return undefined
    }

    return delegation.scopes?.every(
      (scope) => scope.validTo?.toString() === delegation.validTo?.toString(),
    )
      ? delegation.validTo
      : undefined
  }
}
