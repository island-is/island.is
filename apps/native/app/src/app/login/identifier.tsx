import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { LoginIdentifier } from '@/components/device-bound-auth/login-identifier'
import { useIsOffline } from '@/hooks/use-is-offline'
import {
  loginErrorMessageId,
  loginErrorTitleId,
  nativeLoginStore,
  startNativeLogin,
  useNativeLoginStore,
} from '@/lib/native-login'

export default function LoginIdentifierScreen() {
  const router = useRouter()
  const intl = useIntl()
  const { method, loginHint, error } = useNativeLoginStore()
  const [loading, setLoading] = useState(false)
  const isOffline = useIsOffline()

  // An error is about the last try: leaving this screen takes it away.
  useEffect(() => () => nativeLoginStore.setState({ error: undefined }), [])

  const onSubmit = async () => {
    setLoading(true)
    nativeLoginStore.setState({ error: undefined })
    const result = await startNativeLogin()
    setLoading(false)
    if ('error' in result) {
      nativeLoginStore.setState({ error: result.error })
      return
    }
    router.push(
      result.next === 'smsCode' ? '/login/sms-code' : '/login/confirm',
    )
  }

  return (
    <LoginIdentifier
      method={method}
      value={loginHint}
      onChangeValue={(digits) =>
        nativeLoginStore.setState({ loginHint: digits, error: undefined })
      }
      onChangeMethod={(next) =>
        nativeLoginStore.setState({
          method: next,
          loginHint: '',
          error: undefined,
        })
      }
      onSubmit={onSubmit}
      loading={loading}
      error={error && intl.formatMessage({ id: loginErrorMessageId[error] })}
      errorTitle={
        error && loginErrorTitleId[error]
          ? intl.formatMessage({ id: loginErrorTitleId[error] })
          : undefined
      }
      isOffline={isOffline}
    />
  )
}
