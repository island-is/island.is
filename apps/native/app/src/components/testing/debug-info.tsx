import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Alert, AlertButton, Platform, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { config, useConfig } from '@/config'
import { environments } from '@/constants/environments'
import {
  EnvironmentConfig,
  environmentStore,
  useEnvironmentStore,
} from '@/stores/environment-store'
import { Button, token } from '@/ui'
import { SelectionMenu } from 'react-native-platform-components'
import { cognitoAuthUrl } from '../../graphql/client'
import {
  GERVIMENN_PHONES,
  runBiometricUnlockTest,
  runNativeAppLogin,
  runNativeLoginTest,
} from './native-login-test'
import { nextOnboardingStep } from '@/utils/onboarding'

// The feature deployment for native login: IAS and the API that trusts it.
// The switcher doesn't list it, so this is what it would have given.
const FEATURE_ENVIRONMENT: EnvironmentConfig = {
  ...environments.dev,
  id: 'featnative-app-login',
  label: 'featnative-app-login',
  apiUrl: 'https://featnative-app-login-beta.dev01.devland.is/api',
  baseUrl: 'https://featnative-app-login-beta.dev01.devland.is',
  iasIssuer: 'https://featnative-app-login.identity-server.dev01.devland.is',
}

const DebugHost = styled.View`
  background-color: ${token((t) => t.background.brandMinimal)};
  height: 360px;
  max-height: 40%;
`

const Text = styled.Text`
  color: ${token((t) => t.foreground.primary)};
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
  const insets = useSafeAreaInsets()

  const isCognitoAuth = cognito?.accessToken && cognito?.expiresAt > Date.now()
  const cognitoMinutes = Math.floor(
    (cognito?.expiresAt ? cognito.expiresAt - Date.now() : 0) / 1000 / 60,
  )

  const onCognitoLoginPress = () => {
    const url = cognitoAuthUrl()
    WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
    })
  }

  const [showEnvPicker, setShowEnvPicker] = React.useState(false)
  const [envs, setEnvs] = React.useState<EnvironmentConfig[]>([])
  const iasIssuer = useEnvironmentStore((state) => state.environment.iasIssuer)
  const [nativeTestStatus, setNativeTestStatus] = React.useState<string>()
  const [nativeTestRunning, setNativeTestRunning] = React.useState(false)
  // A different gervimaður per platform, so a test on one phone doesn't end
  // the other phone's app login.
  const [nativeTestPhone, setNativeTestPhone] = React.useState(
    GERVIMENN_PHONES[Platform.OS === 'ios' ? 1 : 0],
  )

  const onNextTestUserPress = () => {
    const index = GERVIMENN_PHONES.indexOf(nativeTestPhone)
    setNativeTestPhone(GERVIMENN_PHONES[(index + 1) % GERVIMENN_PHONES.length])
  }

  const runNativeTest = async (
    test: (report: (line: string) => void) => Promise<boolean>,
  ) => {
    setNativeTestRunning(true)
    const lines: string[] = []
    const passed = await test((line) => {
      lines.push(line)
      console.log(`[ias-test] ${line}`)
      setNativeTestStatus(line)
    })
    setNativeTestRunning(false)
    setNativeTestStatus(passed ? 'Passed' : 'Failed')
    Alert.alert(
      passed ? 'Native login test passed' : 'Native login test failed',
      lines.join('\n'),
    )
  }

  const onNativeAppLoginPress = () =>
    runNativeTest(async (report) => {
      const passed = await runNativeAppLogin(report, { phone: nativeTestPhone })
      if (passed) {
        await nextOnboardingStep()
      }
      return passed
    })

  const onNativeLoginTestPress = (keepLogin: boolean) =>
    runNativeTest((report) =>
      runNativeLoginTest(report, { keepLogin, phone: nativeTestPhone }),
    )

  const onEnvironmentPress = () => {
    if (loading) return

    environmentStore
      .getState()
      .actions.loadEnvironments()
      .then((res) => {
        setEnvs(res)
        setShowEnvPicker(true)
      })
  }

  return (
    <DebugHost>
      {/* Scrolls when the rows don't fit; the inset keeps the last rows
          above Android's navigation bar and iOS's home indicator. */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        }}
      >
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
        <SelectionMenu
          visible={showEnvPicker}
          options={envs.map((env) => ({ label: env.label, data: env.id }))}
          selected={environment?.id ?? null}
          onSelect={(data) => {
            setShowEnvPicker(false)
            console.log('emvs', envs)
            const selectedEnv = envs.find((env) => env.id === data)
            if (!selectedEnv) return

            const canSkipCognito =
              selectedEnv.id === 'mock' || selectedEnv.id === 'prod'
            environmentStore.getState().actions.setEnvironment(selectedEnv)

            if (!isCognitoAuth && !canSkipCognito) {
              return Alert.alert(
                'Cognito Required',
                'You can use production without cognito login, but you need it for other environments.',
                [
                  selectedEnv.id !== 'prod' && {
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
          }}
          onRequestClose={() => setShowEnvPicker(false)}
        />
        <DebugRow title="Bundle" value={config.bundleId} />
        <DebugRow title="IDS" value={environment?.idsIssuer ?? 'N/A'} />
        <DebugRow title="API" value={environment?.apiUrl ?? 'N/A'} />
        <DebugRow
          title="IAS"
          value={iasIssuer?.replace(/^https:\/\//, '') ?? 'Same as IDS'}
          actions={[
            iasIssuer
              ? {
                  title: '(Reset)',
                  onPress: () => actions.setEnvironment(environments.dev),
                }
              : {
                  title: '(Feature)',
                  onPress: () => actions.setEnvironment(FEATURE_ENVIRONMENT),
                },
          ]}
        />
        {__DEV__ ? (
          <>
            <DebugRow
              title="User"
              value={`Gervimaður ${nativeTestPhone}`}
              actions={[
                {
                  title: '(Next)',
                  disabled: nativeTestRunning,
                  onPress: onNextTestUserPress,
                },
              ]}
            />
            <DebugRow
              title="Native"
              value={nativeTestStatus ?? 'Login test'}
              actions={[
                {
                  title: '(Run)',
                  disabled: nativeTestRunning,
                  onPress: () => onNativeLoginTestPress(false),
                },
                {
                  title: '(Keep)',
                  disabled: nativeTestRunning,
                  onPress: () => onNativeLoginTestPress(true),
                },
              ]}
            />
            <DebugRow
              title="App"
              value="Native login"
              actions={[
                {
                  title: '(Log in)',
                  disabled: nativeTestRunning,
                  onPress: onNativeAppLoginPress,
                },
              ]}
            />
            <DebugRow
              title="Unlock"
              value="Kept biometric key"
              actions={[
                {
                  title: '(Run)',
                  disabled: nativeTestRunning,
                  onPress: () => runNativeTest(runBiometricUnlockTest),
                },
              ]}
            />
          </>
        ) : null}
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
      </ScrollView>
    </DebugHost>
  )
}
