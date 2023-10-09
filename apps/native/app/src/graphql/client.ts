import {
  ApolloClient,
  ApolloLink,
  fromPromise,
  HttpLink,
  InMemoryCache,
} from '@apollo/client/index';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import {RetryLink} from '@apollo/client/link/retry';
import {authStore} from '../stores/auth-store';
import {getConfig} from '../config';
import {environmentStore} from '../stores/environment-store';

const httpLink = new HttpLink({
  uri() {
    return `${getConfig().apiUrl.replace(/\/$/, '')}/graphql`;
  },
  fetch,
});

const getNewToken = async () => {
  await authStore.getState().refresh();
  return authStore.getState().authorizeResult?.accessToken;
};

const retryLink = new RetryLink({
  attempts: {
    max: 3,
    retryIf(err, _operation) {
      if (err?.length === 0 || !err) {
        return true;
      }
      return false;
    },
  },
});

const errorLink = onError(
  ({graphQLErrors, networkError, forward, operation}) => {
    if (graphQLErrors) {
      if (graphQLErrors?.[0]?.message === 'Unauthorized') {
        return fromPromise(
          getNewToken().catch(error => {
            return;
          }),
        )
          .filter(value => Boolean(value))
          .flatMap((accessToken: any) => {
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${accessToken}`,
              },
            });
            return forward(operation);
          });
      }

      graphQLErrors.map(({message, locations, path}) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations,
          )}, Path: ${JSON.stringify(path)}`,
        ),
      );
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);

      // Detect possible OAuth needed
      if (networkError.name === 'ServerParseError') {
        const redirectUrl = (networkError as any).response?.url;
        if (
          redirectUrl &&
          redirectUrl.indexOf('cognito.shared.devland.is') >= 0
        ) {
          authStore.setState({cognitoAuthUrl: redirectUrl});
        }
      }
    }
  },
);

const getAndRefreshToken = () => {
  const {authorizeResult, refresh} = authStore.getState();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const isTokenAboutToExpire =
    new Date(authorizeResult!.accessTokenExpirationDate!).getTime() <
    Date.now() - 60 * 5 * 1000;
  if (isTokenAboutToExpire) {
    // expires in less than 5 minutes, so refresh
    refresh();
  }
  return authorizeResult?.accessToken;
};

const authLink = setContext(async (_, {headers}) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${getAndRefreshToken()}`,
    'X-Cognito-Token': `Bearer ${
      environmentStore.getState().cognito?.accessToken
    }`,
    cookie: [
      // ...(await CookieManager.get(config.apiEndpoint, true).then(obj2cookie)),
      authStore.getState().cookies,
    ]
      .filter(x => String(x) !== '')
      .join('; '),
  },
}));

export const client = new ApolloClient({
  link: ApolloLink.from([
    // performanceLink,
    retryLink,
    errorLink,
    authLink,
    httpLink,
  ]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          listDocumentsV2: {
            keyArgs: ['input', ['subjectContains', 'opened']],
            read(existing = {}) {
              return existing;
            },
            merge(existing = {}, incoming = {}, options) {
              const {variables} = options ?? {};
              const {page = 1, pageSize = 20} = variables?.input ?? {};
              const offset = (page - 1) * pageSize;
              return {
                ...existing,
                ...incoming,
                data: [
                  ...(existing?.data ?? []).slice(0, offset),
                  ...(incoming?.data ?? []).slice(0, pageSize),
                ],
              };
            },
          }
        },
      },
    },
  }),
});
