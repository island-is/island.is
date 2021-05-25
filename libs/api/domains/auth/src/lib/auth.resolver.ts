import { Query, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Delegation } from './models/delegation.model'
import { UseGuards } from '@nestjs/common'

@UseGuards(IdsUserGuard)
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query((returns) => [Delegation], { name: 'authActorDelegations' })
  async getDelegation(@CurrentUser() user: User): Promise<Delegation[]> {
    return this.authService.getActorDelegations(user)
  }
}
