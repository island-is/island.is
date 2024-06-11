import { HttpException, Inject, Injectable } from '@nestjs/common';
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares';
import type { ConfigType } from '@island.is/nest/config';
import { CmsClientConfig } from './cms-client.config';
import { CmsClientFetchProviderKey } from './cms-client-fetch-provider';
import { GraphQLClient } from 'graphql-request';
import { DocumentNode } from 'graphql';



@Injectable()
export class CmsClientService {
  private readonly client: GraphQLClient;
  constructor(
    @Inject(CmsClientConfig.KEY)
    private readonly config: ConfigType<typeof CmsClientConfig>,
    @Inject(CmsClientFetchProviderKey)
    private readonly fetch: EnhancedFetchAPI,
  ) {
    this.client = new GraphQLClient(this.config.gqlBasePath, {
      method: 'GET',
      jsonSerializer: {
        parse: JSON.parse,
        stringify: JSON.stringify,
      },
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`
      },
      fetch: this.fetch,
    });
  }

  async fetchData(query: DocumentNode, variables?: Record<string, any>) {
    try {
      return await this.client.request(query, variables);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
