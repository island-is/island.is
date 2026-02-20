import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Alert, AlertButton, Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { config, useConfig } from '@/config'
import { environments } from '@/constants/environments'
import { showPicker } from '@/lib/show-picker'
import {
  environmentStore,
  useEnvironmentStore,
} from '@/stores/environment-store'
import { Button, dynamicColor } from '@/ui'
import { ContextMenu } from '@expo/ui/swift-ui'

const DebugHost = styled.SafeAreaView`
  background-color: ${dynamicColor((props) => ({
    light: props.theme.color.blue100,
    dark: props.theme.shades.dark.background,
  }))};
  height: 360px;
  max-height: 40%;
  align-items: center;
  justify-content: center;
`

const Text = styled.Text`
  color: ${dynamicColor((props) => ({
    light: props.theme.color.dark400,
    dark: 'white',
  }))};
`

function DebugRow({
  title,
  actions,
  value,
}: {
  title: string
  value?: string
  actions?: Array<{ title: string; disabled?: boolean; onPress(): void }>
}) {
  const textStyle = {
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 32,
        minHeight: 28,
      }}
    >
      <Text
        style={{
          ...textStyle,
          fontWeight: 'bold',
          paddingRight: 8,
          minWidth: 64,
        }}
      >
        {title}
        {value ? ':' : ''}
      </Text>
      <Text selectable style={{ ...textStyle, flex: 1 }}>
        {value}
      </Text>
      {actions?.map((action, index) => (
        <Button
          key={index}
          isTransparent
          {...action}
          style={{
            paddingTop: 0,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 1,
            minWidth: 0,
          }}
          textStyle={{
            ...textStyle,
            fontWeight: 'bold',
            fontSize: 15,
          }}
        />
      ))}
    </View>
  )
}

export function DebugInfo() {
  const {
    environment = environments.prod,
    cognito,
    actions,
    loading,
  } = useEnvironmentStore()
  const cfg = useConfig()

  const isCognitoAuth = cognito?.accessToken && cognito?.expiresAt > Date.now()
  const cognitoMinutes = Math.floor(
    (cognito?.expiresAt ? cognito.expiresAt - Date.now() : 0) / 1000 / 60,
  )

  const onCognitoLoginPress = () => {
    const params = new URLSearchParams({
      approval_prompt: 'prompt',
      client_id: cfg.cognitoClientId,
      redirect_uri: `${cfg.bundleId}://cognito`,
      response_type: 'token',
      scope: 'openid',
      state: 'state',
    })
    WebBrowser.openBrowserAsync(`${cfg.cognitoUrl}?${params}`, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
    })
  }

  const onEnvironmentPress = () => {
    if (loading) return

    environmentStore
      .getState()
      .actions.loadEnvironments()
      .then((res) => {
        showPicker({
          type: 'radio',
          title: 'Select environment',
          items: res,
          selectedId: environmentStore.getState().environment?.id,
          cancel: true,
        })
          .then(({ selectedItem }: any) => {
            if (!isCognitoAuth && selectedItem?.id !== 'mock') {
              return Alert.alert(
                'Cognito Required',
                'You can use production without cognito login, but you need it for other environments.',
                [
                  environment.id !== 'prod' && {
                    text: 'Switch to Production',
                    onPress: () => actions.setEnvironment(environments.prod),
                  },
                  {
                    text: 'Login with cognito',
                    onPress: onCognitoLoginPress,
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ].filter(Boolean) as AlertButton[],
              )
            }
            if (selectedItem) {
              environmentStore.getState().actions.setEnvironment(selectedItem)
            }
          })
          .catch(() => {
            // noop
          })
      })
  }

  return (
    <DebugHost>
      <DebugRow
        title="Label"
        value={environment?.label ?? 'N/A'}
        actions={[
          {
            title: '(Switch)',
            disabled: loading,
            onPress: onEnvironmentPress,
          },
        ]}
      />
      <DebugRow title="Bundle" value={config.bundleId} />
      <DebugRow title="IDS" value={environment?.idsIssuer ?? 'N/A'} />
      <DebugRow title="API" value={environment?.apiUrl ?? 'N/A'} />
      <DebugRow
        title="Cognito"
        value={isCognitoAuth ? `Yes (exp ${cognitoMinutes}m)` : 'No'}
        actions={[
          {
            title: '(Login)',
            onPress: onCognitoLoginPress,
          },
        ]}
      />
    </DebugHost>
  )
}
