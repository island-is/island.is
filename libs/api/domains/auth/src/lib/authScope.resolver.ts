import { Query, Parent, Resolver, ResolveField } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { AuthService } from './auth.service'
import { AuthScope } from './models'

@UseGuards(IdsUserGuard)
@Resolver(() => AuthScope)
export class AuthScopeResolver {
  constructor(private authService: AuthService) {}

  @Query(() => [AuthScope], { name: 'authScopes' })
  getAuthScopes(): Promise<AuthScope[]> {
    return this.authService.getAuthScopes()
  }

  @ResolveField('groupName')
  resolveGroupName(@Parent() authScope: typeof AuthScope): string {
    // XXX: waiting on auth-public-api implementation
    // return authScope.group.displayName
    return '1337'
  }
}
