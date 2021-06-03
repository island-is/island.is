import { Query, Mutation, Resolver, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

import { UpdateDelegationInput, DelegationInput } from './dto'
import { Delegation, AuthScope } from './models'
import { AuthService } from './auth.service'

@UseGuards(IdsUserGuard)
@Resolver()
export class MainResolver {
  constructor(private authService: AuthService) {}

  @Query(() => [Delegation], { name: 'authActorDelegations' })
  getDelegations(@CurrentUser() user: User): Promise<Delegation[]> {
    return this.authService.getActorDelegations(user)
  }
}
