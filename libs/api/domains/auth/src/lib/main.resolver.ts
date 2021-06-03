import { Query, Mutation, Resolver, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import { UpdateDelegationInput, DelegationInput } from './dto'
import { Delegation, AuthScope } from './models'
import { AuthService } from './auth.service'

const ignore404 = (e: Error) => {
  if ((e as any).status !== 404) {
    throw e
  }
}

@UseGuards(IdsUserGuard)
@Resolver()
export class MainResolver {
  constructor(private authService: AuthService) {}

  @Query(() => [Delegation], { name: 'authActorDelegations' })
  getDelegations(@CurrentUser() user: User): Promise<Delegation[]> {
    return this.authService.getActorDelegations(user)
  }

  @Query(() => Delegation, { name: 'authDelegation' })
  async getDelegation(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationInput }) input: DelegationInput,
  ): Promise<Delegation> {
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
  ): Promise<Delegation> {
    return this.authService.updateDelegation(user, input)
  }
}
