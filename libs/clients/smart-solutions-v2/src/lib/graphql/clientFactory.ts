import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import errorLink from './errorLink'
import { authLink } from './authLink'
import {
  APOLLO_CLIENT_FACTORY,
  SmartSolutionsModuleOptions,
} from '../smartSolutions.types'
import { MODULE_OPTIONS_TOKEN } from '../smartSolutions.module-definition'
import { Provider } from '@nestjs/common'

const httpLink = (uri: string) =>
  new HttpLink({
    uri,
    fetch,
  })

const retryLink = new RetryLink()

export const clientFactory: Provider<ApolloClient<NormalizedCacheObject>> = {
  provide: APOLLO_CLIENT_FACTORY,
  useFactory: (options: SmartSolutionsModuleOptions) => {
    return new ApolloClient({
      link: ApolloLink.from([
        retryLink,
        errorLink,
        authLink(options.config.apiKey),
        httpLink(options.config.apiUrl),
      ]),
      cache: new InMemoryCache(),
    })
  },
  inject: [MODULE_OPTIONS_TOKEN],
}
