import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import { Identity } from '@island.is/api/domains/identity'
import { IdentityClientService } from '@island.is/clients/identity'

import type { DelegationDTO } from '@island.is/clients/auth/delegation-api'
import type { MergedDelegationDTO } from '@island.is/clients/auth/public-api'

import {
  CreateDelegationInput,
  CreateDelegationsInput,
  DelegationInput,
  DelegationsInput,
  DeleteDelegationInput,
  PatchDelegationInput,
  UpdateDelegationInput,
} from '../dto'
import { Delegation, MergedDelegation } from '../models/delegation.model'
import { DelegationsGroupedByIdentity } from '../dto/delegationsGroupedByIdentity.dto'
import { ActorDelegationsService } from '../services/actorDelegations.service'
import { ActorDelegationInput } from '../dto/actorDelegation.input'
import { MeDelegationsService } from '../services/meDelegations.service'
import { MeDelegationsControllerFindAllDirectionEnum } from '@island.is/clients/auth/delegation-api'

@UseGuards(IdsUserGuard)
@Resolver(() => Delegation)
export class DelegationResolver {
  constructor(
    private meDelegationsService: MeDelegationsService,
    private actorDelegationsService: ActorDelegationsService,
    private identityService: IdentityClientService,
  ) {}

  @Query(() => [MergedDelegation], { name: 'authActorDelegations' })
  getActorDelegations(
    @CurrentUser() user: User,
    @Args('input', { type: () => ActorDelegationInput, nullable: true })
    input?: ActorDelegationInput,
  ): Promise<MergedDelegationDTO[]> {
    return this.actorDelegationsService.getActorDelegations(
      user,
      input?.delegationTypes,
    )
  }

  @Query(() => [Delegation], { name: 'authDelegations' })
  getDelegations(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationsInput, nullable: true })
    input: DelegationsInput = {},
  ): Promise<DelegationDTO[]> {
    return this.meDelegationsService.getDelegations(user, input)
  }

  @Query(() => [DelegationsGroupedByIdentity], {
    name: 'authDelegationsGroupedByIdentityOutgoing',
  })
  getDelegationsGroupedByIdentityOutgoing(
    @CurrentUser() user: User,
  ): Promise<DelegationsGroupedByIdentity[]> {
    return this.meDelegationsService.getDelegationsGroupedByIdentity(user, {
      direction: MeDelegationsControllerFindAllDirectionEnum.outgoing,
    })
  }

  @Query(() => [DelegationsGroupedByIdentity], {
    name: 'authDelegationsGroupedByIdentityIncoming',
  })
  getDelegationsGroupedByIdentityIncoming(
    @CurrentUser() user: User,
  ): Promise<DelegationsGroupedByIdentity[]> {
    return this.meDelegationsService.getDelegationsGroupedByIdentity(user, {
      direction: MeDelegationsControllerFindAllDirectionEnum.incoming,
    })
  }

  @Query(() => Delegation, { name: 'authDelegation', nullable: true })
  async getDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationInput }) input: DelegationInput,
  ): Promise<DelegationDTO | null> {
    return this.meDelegationsService.getDelegationById(user, input)
  }

  @Mutation(() => Delegation, { name: 'createAuthDelegation' })
  createDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateDelegationInput })
    input: CreateDelegationInput,
  ): Promise<DelegationDTO | null> {
    return this.meDelegationsService.createOrUpdateDelegation(user, input)
  }

  @Mutation(() => [Delegation], { name: 'createAuthDelegations' })
  createDelegations(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateDelegationsInput })
    input: CreateDelegationsInput,
  ): Promise<DelegationDTO[]> {
    return this.meDelegationsService.createOrUpdateDelegations(user, input)
  }

  @Mutation(() => Delegation, {
    name: 'updateAuthDelegation',
    deprecationReason:
      'Use patchAuthDelegation instead for increased consistency.',
  })
  updateDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateDelegationInput })
    input: UpdateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.meDelegationsService.updateDelegation(user, input)
  }

  @Mutation(() => Delegation, { name: 'patchAuthDelegation' })
  patchDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => PatchDelegationInput })
    input: PatchDelegationInput,
  ): Promise<DelegationDTO> {
    return this.meDelegationsService.patchDelegation(user, input)
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
  async resolveTo(@Parent() delegation: DelegationDTO): Promise<Identity> {
    return this.identityService.getIdentityWithFallback(
      delegation.toNationalId,
      {
        name: delegation.toName ?? undefined,
      },
    )
  }

  @ResolveField('from', () => Identity)
  async resolveFrom(@Parent() delegation: DelegationDTO): Promise<Identity> {
    return this.identityService.getIdentityWithFallback(
      delegation.fromNationalId,
      {
        name: delegation.fromName ?? undefined,
      },
    )
  }

  @ResolveField('createdBy', () => Identity, { nullable: true })
  async resolveCreatedBy(
    @Parent() delegation: DelegationDTO,
  ): Promise<Identity | null> {
    if (!delegation.createdByNationalId) {
      return null
    }

    return this.identityService.getIdentity(delegation.createdByNationalId)
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
