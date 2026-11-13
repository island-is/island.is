import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'

import { ElectronicIdConfirmation } from '@/components/device-bound-auth/electronic-id-confirmation'
import {
  LoginIdentifier,
  LoginMethod,
} from '@/components/device-bound-auth/login-identifier'
import { LoginWelcome } from '@/components/device-bound-auth/login-welcome'
import { preferencesStore } from '@/stores/preferences-store'

type Variant = 'welcome' | 'identifier' | 'waiting'

export default function LoginPreview() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    variant?: Variant
    method?: LoginMethod
    /** `off` shows D0 as a store build would, without the debug panel */
    debug?: 'off'
  }>()
  const [method, setMethod] = useState<LoginMethod>(params.method ?? 'sim')
  const [value, setValue] = useState('')

  if (params.variant === 'identifier') {
    return (
      <LoginIdentifier
        method={method}
        value={value}
        onChangeValue={setValue}
        onSubmit={() =>
          router.push('/dev/device-bound-auth/login?variant=waiting')
        }
        onChangeMethod={(next) => {
          setMethod(next)
          setValue('')
        }}
        onBackPress={() => router.back()}
      />
    )
  }

  if (params.variant === 'waiting') {
    return (
      <ElectronicIdConfirmation
        purpose="login"
        verificationCode="1336"
        onCancelPress={() => router.back()}
      />
    )
  }

  return (
    <LoginWelcome
      showDebugInfo={params.debug === 'off' ? false : undefined}
      onLoginPress={() =>
        router.push('/dev/device-bound-auth/login?variant=identifier')
      }
      onLanguagePress={() => {
        const { locale, setLocale } = preferencesStore.getState()
        setLocale(locale === 'en-US' ? 'is-IS' : 'en-US')
      }}
    />
  )
}
