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

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
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
@Resolver(() => CustomDelegation)
@Resolver(() => LegalGuardianDelegation)
@Resolver(() => ProcuringHolderDelegation)
export class DelegationResolver {
  constructor(private authService: AuthService) {}

  @Query(() => [Delegation], { name: 'authActorDelegations' })
  getActorDelegations(@CurrentUser() user: User): Promise<Delegation[]> {
    return this.authService.getActorDelegations(user)
  }

  @Query(() => [Delegation], { name: 'authDelegations' })
  getDelegations(@CurrentUser() user: User): Promise<Delegation[]> {
    return this.authService.getDelegations(user)
  }

  @Query(() => Delegation, { name: 'authDelegation', nullable: true })
  async getDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationInput }) input: DelegationInput,
  ): Promise<Delegation | null> {
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
    } else if (delegation.toName !== input.name) {
      return this.authService.updateDelegation(
        user,
        input as UpdateDelegationInput,
      )
    }

    return delegation
  }

  @Mutation(() => Delegation, { name: 'updateAuthDelegation' })
  updateDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateDelegationInput })
    input: UpdateDelegationInput,
  ): Promise<Delegation> {
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
}
