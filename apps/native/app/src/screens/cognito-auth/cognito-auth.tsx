import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  gql,
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { ActionSheetIOS, Linking, Text, View } from 'react-native'
import {
  AuthConfiguration,
  AuthorizeResult,
  authorize,
} from 'react-native-app-auth'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'

import { Button } from '../../ui'
import { config } from '../../config'
import { openNativeBrowser } from '../../lib/rn-island'
import { cognitoAuthUrl, configs } from './config-switcher'

const apolloConfig = {
  url: '',
  cognitoToken: '',
  accessToken: '',
}

const httpLink = new HttpLink({
  uri: (x) => {
    return `${apolloConfig.url}/graphql`
  },
  fetch,
})

const authLink = setContext(async (_, { headers }) => ({
  headers: {
    ...headers,
    // 'x-forwarded-authorization': `Bearer ${user?.accessToken}`,
    authorization: `Bearer ${apolloConfig.cognitoToken}`,
  },
}))

const link = ApolloLink.from([authLink, httpLink])

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})

const useAsyncStorageState = <T,>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] => {
  const storage = useAsyncStorage(`@test/${key}`)
  const [state, setState] = useState<T>(defaultValue)

  useEffect(() => {
    storage.getItem((err, value) => {
      if (value) {
        setState(JSON.parse(value))
      }
    })
  }, [])

  const set = (value: T) => {
    setState(value)
    storage.setItem(JSON.stringify(value))
  }

  return [state, set]
}

type CognitoToken = {
  id_token: string
  access_token: string
  expires_in: number
  token_type: string
}

export const CognitoAuthScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  const [envConfig, setEnvConfig] = useAsyncStorageState('env', configs[0])
  const [cognito, setCognito] = useAsyncStorageState<CognitoToken | null>(
    'cognito',
    null,
  )
  const [user, setUser] = useAsyncStorageState<AuthorizeResult | null>(
    'user',
    null,
  )

  useEffect(() => {
    Linking.addEventListener('url', ({ url }) => {
      Navigation.dismissAllModals()
      if (/cognito/.test(url)) {
        const [, hash] = url.split('#')
        const params = String(hash)
          .split('&')
          .reduce((acc, param) => {
            const [key, value] = param.split('=')
            acc[key] = value
            return acc
          }, {} as Record<string, string>)
        setCognito({
          id_token: params.id_token,
          access_token: params.access_token,
          expires_in: Number(params.expires_in),
          token_type: params.token_type,
        })
      }
    })
  }, [])

  useEffect(() => {
    apolloConfig.accessToken = user?.accessToken || ''
    apolloConfig.cognitoToken = cognito?.access_token || ''
    apolloConfig.url = envConfig.apiUrl
  }, [envConfig, cognito, user])

  return (
    <View style={{ margin: 32 }}>
      <Text
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        Cognito: {cognito ? 'Logged in' : 'Not logged in'}
        {'\n'}
        IDS: {user ? 'Logged in' : 'Not logged in'}
        {'\n'}
        Env: {envConfig.name}
        {'\n'}
        Bundle ID: {config.bundleId}
      </Text>
      <Button
        onPress={() => {
          openNativeBrowser(cognitoAuthUrl(), componentId)
        }}
        title="Cognito Login"
      />
      <Button
        title="test"
        onPress={() => {
          openNativeBrowser(
            'https://auth.shared.devland.is/dev/oauth2/start?rd=https%3A%2F%2Fbeta.dev01.devland.is/',
            componentId,
          )
        }}
      />
      <Button
        onPress={async () => {
          const appAuthConfig: AuthConfiguration = {
            issuer: envConfig.ids.issuer,
            clientId: envConfig.ids.clientId,
            redirectUrl: `${config.bundleId}://oauth`,
            scopes: envConfig.ids.scopes.split(' '),
          }
          const authorizeResult = await authorize({
            ...appAuthConfig,
            additionalParameters: {
              prompt: 'login',
              prompt_delegations: 'true',
              ui_locales: 'is-IS',
              externalUserAgent: 'yes',
            },
          })
          setUser(authorizeResult)
        }}
        disabled={!cognito}
        title="IDS Login"
      />
      <Button
        title="Test Cookies"
        onPress={async () => {
          // CookieManager.getAll().then(res => {
          //   console.log('Got cookies', res);
          // });
        }}
      />
      <Button
        onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: [...configs.map((cfg) => cfg.name), 'Cancel'],
              title: 'Switch Environment',
              cancelButtonIndex: configs.length,
            },
            (buttonIndex) => {
              if (buttonIndex < configs.length) {
                setEnvConfig(configs[buttonIndex])
              }
            },
          )
        }}
        title="Switch Environment"
      />
      <Button
        title="Test GraphQL"
        onPress={() => {
          client
            .query({
              query: gql`
                query GetNamespace($input: GetNamespaceInput!) {
                  getNamespace(input: $input) {
                    fields
                  }
                }
              `,
              variables: {
                input: { lang: 'is', namespace: 'ChatPanels' },
              },
            })
            .then((res) => {
              console.log('result', res)
            })
            .catch((err) => {
              console.log('error', err)
            })
        }}
      />
    </View>
  )
}
