import { GraphQLClient } from 'graphql-request'
import { Provider } from '@nestjs/common'
import { MODULE_OPTIONS_TOKEN } from './smartSolutions.module-definition'
import { LazyDuringDevScope } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  GRAPHQL_CLIENT_FACTORY,
  SmartSolutionsModuleOptions,
} from './types/config.type'

export const gqlClientFactory: Provider<GraphQLClient> = {
  provide: GRAPHQL_CLIENT_FACTORY,
  scope: LazyDuringDevScope,
  useFactory: (options: SmartSolutionsModuleOptions) => {
    return new GraphQLClient(options.config.apiUrl, {
      method: 'POST',
      jsonSerializer: {
        parse: JSON.parse,
        stringify: JSON.stringify,
      },
      headers: {
        'X-API-KEY': options.config.apiKey,
      },
      fetch: createEnhancedFetch({
        name: 'clients-smart-solutions-v2',
      }) as unknown as (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) => Promise<Response>,
    })
  },
  inject: [MODULE_OPTIONS_TOKEN],
}
