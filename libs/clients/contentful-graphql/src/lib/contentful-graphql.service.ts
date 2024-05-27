import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'
import { ContentfulGraphQLClientConfig } from './contentful-graphql.config'
import { ContentfulGraphQLFetchProviderKey } from './contentful-graphql-fetch-provider'

const baseGqlRequestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`
  },
}

interface RequestBody {
  query: string
  variables: {
    input: object
  }
}

@Injectable()
export class ContentfulGraphQLClientService {
  constructor(
    @Inject(ContentfulGraphQLClientConfig.KEY)
    private readonly config: ConfigType<typeof ContentfulGraphQLClientConfig>,
    @Inject(ContentfulGraphQLFetchProviderKey)
    private readonly fetch: EnhancedFetchAPI,
  ) {}

  async gqlRequestWithAuth(user: User, body: RequestBody) {
    return await this.fetch(this.config.gqlBasePath, {
      ...baseGqlRequestOptions,
      auth: user,
      body: JSON.stringify(body),
    })
  }
}
