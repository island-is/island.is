import { HttpException, Inject, Injectable } from '@nestjs/common';
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares';
import type { ConfigType } from '@island.is/nest/config';
import { ContentfulGraphQLClientConfig } from './contentful-graphql.config';
import { ContentfulGraphQLFetchProviderKey } from './contentful-graphql-fetch-provider';
import { GraphQLClient } from 'graphql-request';

@Injectable()
export class ContentfulGraphQLClientService {
  private readonly client: GraphQLClient;
  constructor(
    @Inject(ContentfulGraphQLClientConfig.KEY)
    private readonly config: ConfigType<typeof ContentfulGraphQLClientConfig>,
    @Inject(ContentfulGraphQLFetchProviderKey)
    private readonly fetch: EnhancedFetchAPI,
  ) {
    this.client = new GraphQLClient(this.config.gqlBasePath, {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      fetch: this.fetch,
    });
  }

  async fetchData(queryString: string, variables?: Record<string, any>) {
    try {
      return await this.client.request(queryString, variables);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
