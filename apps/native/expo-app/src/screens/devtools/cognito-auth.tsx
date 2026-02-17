import React, { useRef, useState } from 'react'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useNavigationComponentDidDisappear } from 'react-native-navigation-hooks'
import { WebView, WebViewNavigation } from 'react-native-webview'
import { authStore } from '../../stores/auth-store'

// @todo add dismiss button
export const CognitoAuthScreen: NavigationFunctionComponent<{
  url: string
}> = (props) => {
  const ref = useRef<WebView>(null)
  const [url, setUrl] = useState(props.url)

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    if (
      navigationState.url.indexOf(
        'https://auth.shared.devland.is/dev/oauth2/sign_in',
      ) === 0
    ) {
      setUrl('https://auth.shared.devland.is/dev/oauth2/sign_in')
    }

    if (
      navigationState.url.indexOf(
        'https://auth.shared.devland.is/dev/oauth2/callback',
      ) === 0
    ) {
      setUrl('https://auth.shared.devland.is/dev/oauth2/sign_in')
    }

    if (navigationState.url === 'https://auth.shared.devland.is/') {
      // Success
      Navigation.dismissModal(props.componentId)
      authStore.setState({ isCogitoAuth: false })
    }
  }

  useNavigationComponentDidDisappear(() => {
    authStore.setState((prev) => ({
      isCogitoAuth: false,
      cognitoDismissCount: prev.cognitoDismissCount + 1,
    }))
  })

  return (
    <WebView
      ref={ref}
      style={{ flex: 1 }}
      source={{ uri: url }}
      onNavigationStateChange={onNavigationStateChange}
      thirdPartyCookiesEnabled
      sharedCookiesEnabled
    />
  )
}
