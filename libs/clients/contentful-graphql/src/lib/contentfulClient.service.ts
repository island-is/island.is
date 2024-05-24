import { Inject, Injectable } from '@nestjs/common'
import { print } from 'graphql'

import { User } from '@island.is/auth-nest-tools'
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'

import { ContentfulClientConfig } from './contentfulClient.config'
import { ContentfulFetchProviderKey } from './contentfulFetchProvider'

const baseGqlRequestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
}

interface RequestBody {
  query: string
  variables: {
    input: object
  }
}

@Injectable()
export class ContentfulClientService {
  constructor(
    @Inject(ContentfulClientConfig.KEY)
    private readonly config: ConfigType<typeof ContentfulClientConfig>,
    @Inject(ContentfulFetchProviderKey)
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
