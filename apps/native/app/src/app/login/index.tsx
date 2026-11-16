import { useRouter } from 'expo-router'
import React from 'react'
import { Alert } from 'react-native'

import { LoginWelcome } from '@/components/device-bound-auth/login-welcome'
import { environments } from '@/constants/environments'
import { authStore } from '@/stores/auth-store'
import { useEnvironmentStore } from '@/stores/environment-store'
import { preferencesStore } from '@/stores/preferences-store'
import { nextOnboardingStep } from '@/utils/onboarding'

// The Mock environment logs in without IAS, for the Maestro tests.
async function logInWithMocks() {
  const { setupNativeMocking } = await import('@island.is/api/mocks/native')
  await setupNativeMocking()
  preferencesStore.setState({
    hasOnboardedBiometrics: true,
    hasOnboardedPinCode: true,
    hasOnboardedNotifications: true,
  })
  authStore.setState({
    authorizeResult: {
      accessToken: 'mock-access-token',
      tokenType: 'Bearer',
      accessTokenExpirationDate: new Date(
        Date.now() + 3600 * 1000,
      ).toISOString(),
      idToken: 'mock-id-token',
      refreshToken: 'mock-refresh-token',
      scopes: [],
    },
    userInfo: {
      name: 'Mock User',
      nationalId: '0000000000',
      sub: 'mock-user',
    },
  })
  await nextOnboardingStep()
}

export default function LoginScreen() {
  const router = useRouter()
  const { environment = environments.prod, cognito } = useEnvironmentStore()

  const onLoginPress = async () => {
    if (environment.id === 'mock') {
      await logInWithMocks()
      return
    }

    const isCognitoAuth =
      cognito?.accessToken && cognito?.expiresAt > Date.now()
    if (
      environment.idsIssuer !== environments.prod.idsIssuer &&
      !isCognitoAuth
    ) {
      Alert.alert(
        'Cognito required',
        'Please authenticate with cognito before logging in.',
      )
      return
    }

    router.push('/login/identifier')
  }

  const onLanguagePress = () => {
    const { locale, setLocale } = preferencesStore.getState()
    setLocale(locale === 'en-US' ? 'is-IS' : 'en-US')
  }

  return (
    <LoginWelcome
      onLoginPress={onLoginPress}
      onLanguagePress={onLanguagePress}
    />
  )
}
