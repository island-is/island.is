import React, { useRef } from 'react';
import { Navigation, NavigationFunctionComponent } from "react-native-navigation";
import { WebView, WebViewNavigation } from "react-native-webview";
import { useState } from 'react';
import { authStore } from '../../stores/auth-store';
import { useNavigationComponentDidDisappear } from 'react-native-navigation-hooks/dist';

// @todo add dismiss button
export const CognitoAuthScreen: NavigationFunctionComponent<{ url: string }> = (props) => {
  const ref = useRef<WebView>(null);
  const [url, setUrl] = useState(props.url);
  console.log(ref);

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    if (navigationState.url.indexOf('https://auth.shared.devland.is/dev/oauth2/sign_in') >= 0) {
      setUrl('https://auth.shared.devland.is/dev/oauth2/sign_in');
    }

    if (navigationState.url === 'https://auth.shared.devland.is/dev/oauth2/sign_in') {
      Navigation.dismissModal(props.componentId);
      authStore.setState({ isCogitoAuth: false });
    }
  };

  useNavigationComponentDidDisappear(() => {
    authStore.setState({ isCogitoAuth: false });
  })

  return <WebView
    ref={ref}
    style={{ flex: 1 }}
    source={{ uri: url }}
    onNavigationStateChange={onNavigationStateChange}
    thirdPartyCookiesEnabled
    sharedCookiesEnabled
  />;
}
