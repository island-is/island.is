import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { setContext } from '@apollo/client/link/context'
import { config } from '../utils/config'
import { authStore } from '../stores/auth-store'
import { typeDefs } from './type-defs';
import { typePolicies } from './type-policies';

const uri = `${config.apiEndpoint.replace(/\/$/, '')}/graphql`;

const httpLink = new HttpLink({
  uri,
  fetch,
  credentials: 'omit'
})

const retryLink = new RetryLink()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${authStore.getState().authorizeResult?.accessToken}`,
    cookie: '_oauth2_proxy=r__z4Tbta1PUXKY128qy7Dmkfv4m3l3CjLWm-WBPYypAGVAX-3CjUR9lU2tVCGyswxUrslQJnWPgd5QXVqWSi11MdgTN2j_TVQiDt2RiEMFEDrH_R_iM-H1-A4w6CrSNL31P1qUP9YZZgLqfvQjbmhA8DQBH13qblJ2CymnOGJ-2-YUI1ACycACMgrjvEcHXP3a78Gysg8mYcDAmlPgocJESW7hZvUCZBQG6LA==|1617018955|l6x4wFhVCAfpNmwK8wkvlWJOPmSXwnLuKmEFBrgPV70=',
  },
}))

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache({ typePolicies }),
  typeDefs,
})
