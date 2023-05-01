import { UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { Loader } from '@island.is/nest/dataloader'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { ApiScopeDataLoader, ApiScopeLoader } from '@island.is/api/domains/auth'

import { ClientEnvironment } from './models/client-environment.model'
import { AllowedScope } from './models/allowedScope.model'

@UseGuards(IdsUserGuard)
@Resolver(() => ClientEnvironment)
export class ClientEnvironmentResolver {
  @ResolveField('allowedScopes', () => [AllowedScope], { nullable: true })
  async resolveAllowedScopes(
    @Loader(ApiScopeLoader) apiScopeLoader: ApiScopeDataLoader,
    @Parent()
    { tenantId, allowedScopes }: ClientEnvironment,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<AllowedScope[]> {
    // Return empty array if no allowed scopes are defined
    if (!allowedScopes) {
      return []
    }

    return Promise.all(
      allowedScopes.map(({ scopeName }) =>
        apiScopeLoader.load({
          lang,
          domain: tenantId,
          name: scopeName,
        }),
      ),
    )
  }
}
