import { Query, Parent, Resolver, ResolveField, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { IdsUserGuard, CurrentUser } from '@island.is/auth-nest-tools'
import type { ApiScope as IApiScope } from '@island.is/clients/auth-public-api'

import { ApiScopesInput } from '../dto/apiScopes.input'
import { ApiScopeService } from '../apiScope.service'
import { ApiScope } from '../models'

@UseGuards(IdsUserGuard)
@Resolver(() => ApiScope)
export class ApiScopeResolver {
  constructor(private apiScope: ApiScopeService) {}

  @Query(() => [ApiScope], { name: 'authApiScopes' })
  getApiScopes(
    @CurrentUser() user: User,
    @Args('input') { lang }: ApiScopesInput,
  ): Promise<IApiScope[]> {
    return this.apiScope.getApiScopes(user, lang)
  }

  @ResolveField(() => String, { nullable: true, name: 'groupName' })
  resolveGroupName(@Parent() apiScope: IApiScope): string | undefined {
    return apiScope.group?.displayName
  }

  @ResolveField('type')
  resolveType(): string {
    // TODO: waiting on implementation
    return 'ApiScope'
  }
}
