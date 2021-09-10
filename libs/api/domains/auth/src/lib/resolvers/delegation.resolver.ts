import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  ID,
  Resolver,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import * as kennitala from 'kennitala'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { Identity, IdentityService } from '@island.is/api/domains/identity'
import type { User } from '@island.is/auth-nest-tools'
import type { DelegationDTO } from '@island.is/clients/auth-public-api'

import {
  UpdateDelegationInput,
  DeleteDelegationInput,
  CreateDelegationInput,
  DelegationInput,
} from '../dto'
import {
  Delegation,
  CustomDelegation,
  LegalGuardianDelegation,
  ProcuringHolderDelegation,
} from '../models'
import { AuthService } from '../auth.service'

const ignore404 = (e: Response) => {
  if (e.status !== 404) {
    throw e
  }
}

@UseGuards(IdsUserGuard)
@Resolver(() => Delegation)
export class DelegationResolver {
  constructor(
    private authService: AuthService,
    private identityService: IdentityService,
  ) {}

  @Query(() => [Delegation], { name: 'authActorDelegations' })
  getActorDelegations(@CurrentUser() user: User): Promise<DelegationDTO[]> {
    return this.authService.getActorDelegations(user)
  }

  @Query(() => [Delegation], { name: 'authDelegations' })
  getDelegations(@CurrentUser() user: User): Promise<DelegationDTO[]> {
    return this.authService.getDelegations(user)
  }

  @Query(() => Delegation, { name: 'authDelegation', nullable: true })
  async getDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationInput }) input: DelegationInput,
  ): Promise<DelegationDTO | null> {
    const delegation = await this.authService
      .getDelegationFromNationalId(user, input)
      .catch(ignore404)
    if (!delegation) {
      return null
    }

    return delegation
  }

  @Mutation(() => Delegation, { name: 'createAuthDelegation' })
  async createDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateDelegationInput })
    input: CreateDelegationInput,
  ): Promise<DelegationDTO | null> {
    let delegation = await this.authService
      .getDelegationFromNationalId(user, input)
      .catch(ignore404)
    if (!delegation) {
      delegation = await this.authService.createDelegation(user, input)
    }

    return delegation
  }

  @Mutation(() => Delegation, { name: 'updateAuthDelegation' })
  updateDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateDelegationInput })
    input: UpdateDelegationInput,
  ): Promise<DelegationDTO> {
    return this.authService.updateDelegation(user, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAuthDelegation' })
  deleteDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeleteDelegationInput })
    input: DeleteDelegationInput,
  ): Promise<boolean> {
    return this.authService.deleteDelegation(user, input)
  }

  @ResolveField('id', () => ID)
  resolveId(@Parent() delegation: DelegationDTO): string {
    return `${delegation.fromNationalId}-${delegation.toNationalId}`
  }

  @ResolveField('to', () => Identity)
  resolveTo(
    @Parent() delegation: DelegationDTO,
    @CurrentUser() user: User,
  ): Promise<Identity | null> {
    if (kennitala.isCompany(delegation.toNationalId)) {
      // XXX: temp until rsk gets implemented
      return Promise.resolve({
        nationalId: delegation.toNationalId,
        name: delegation.toName,
        type: 'company',
      } as Identity)
    }
    return this.identityService.getIdentity(delegation.toNationalId, user)
  }

  @ResolveField('from', () => Identity)
  resolveFrom(
    @Parent() delegation: DelegationDTO,
    @CurrentUser() user: User,
  ): Promise<Identity | null> {
    if (kennitala.isCompany(delegation.fromNationalId)) {
      // XXX: temp until rsk gets implemented
      return Promise.resolve({
        nationalId: delegation.fromNationalId,
        name: delegation.fromName,
        type: 'company',
      } as Identity)
    }
    return this.identityService.getIdentity(delegation.fromNationalId, user)
  }

  @ResolveField('validTo', () => Date, { nullable: true })
  resolveValidTo(@Parent() delegation: DelegationDTO): Date | undefined {
    return delegation.scopes?.every(
      (scope) => scope.validTo?.toString() === delegation.validTo?.toString(),
    )
      ? delegation.validTo
      : undefined
  }
}
