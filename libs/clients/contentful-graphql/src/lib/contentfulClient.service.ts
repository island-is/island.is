import { Inject, Injectable } from '@nestjs/common'
import { print } from 'graphql'
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
  variables: { [key: string]: any }
}

@Injectable()
export class ContentfulClientService {
  constructor(
    @Inject(ContentfulClientConfig.KEY)
    private readonly config: ConfigType<typeof ContentfulClientConfig>,
    @Inject(ContentfulFetchProviderKey)
    private readonly fetch: EnhancedFetchAPI,
  ) {}

  async gqlRequest(body: RequestBody) {
    return await this.fetch(
      `https://graphql.contentful.com/content/v1/spaces/${this.config.spaceId}/environments/${this.config.environment}`,
      {
        ...baseGqlRequestOptions,
        headers: {
          ...baseGqlRequestOptions.headers,
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(body),
      },
    )
  }

  async fetchContent(query: string, variables: { [key: string]: any } = {}) {
    const response = await this.gqlRequest({ query, variables })
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch content from Contentful`)
    }
    return await response.json()
  }
}
