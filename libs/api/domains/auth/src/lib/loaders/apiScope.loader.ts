import DataLoader from 'dataloader'
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import uniq from 'lodash/uniq'
import zipObject from 'lodash/zipObject'

import { NestDataLoader, GraphQLContext } from '@island.is/nest/dataloader'
import { User } from '@island.is/auth-nest-tools'
import { ApiScopeInput } from '../dto/apiScope.input'
import { ApiScope } from '../models'
import { ApiScopeService } from '../services/apiScope.service'
import { ISLAND_DOMAIN } from '../services-v1/constants'

export type ApiScopeDataLoader = DataLoader<ApiScopeInput, ApiScope, string>

@Injectable()
export class ApiScopeLoader implements NestDataLoader<ApiScopeInput, ApiScope> {
  constructor(private readonly apiScopeService: ApiScopeService) {}

  keyFn(input: ApiScopeInput): string {
    return `${input.lang}##${input.name}`
  }

  async loadApiScopes(
    user: User | undefined,
    inputs: readonly ApiScopeInput[],
  ): Promise<Array<ApiScope | Error>> {
    if (!user) {
      throw new UnauthorizedException()
    }

    // Only support one language at a time.
    const lang = inputs[0].lang
    const domains = uniq(inputs.map((input) => input.domain ?? ISLAND_DOMAIN))
    const apiScopeLists = await Promise.all(
      domains.map((domain) =>
        this.apiScopeService.getApiScopes(user, { lang, domain }),
      ),
    )
    const apiScopesByDomain = zipObject(domains, apiScopeLists)

    return inputs.map((input) => {
      const apiScopes = apiScopesByDomain[input.domain ?? ISLAND_DOMAIN]
      return (
        apiScopes.find((apiScope) => apiScope.name === input.name) ??
        new NotFoundException(`Could not find scope: ${input.name}`)
      )
    })
  }

  generateDataLoader(ctx: GraphQLContext): ApiScopeDataLoader {
    return new DataLoader(this.loadApiScopes.bind(this, ctx.req.user), {
      cacheKeyFn: this.keyFn,
    })
  }
}
