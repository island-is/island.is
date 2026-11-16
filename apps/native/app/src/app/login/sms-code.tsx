import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import { formatLoginHint } from '@/components/device-bound-auth/login-identifier'
import { LoginSmsCode } from '@/components/device-bound-auth/login-sms-code'
import {
  loginErrorMessageId,
  nativeLoginStore,
  SMS_CODE_LENGTH,
  startNativeLogin,
  StartLoginResult,
  useNativeLoginStore,
} from '@/lib/native-login'

type LoginErrorResult = Extract<StartLoginResult, { error: unknown }>

export default function LoginSmsCodeScreen() {
  const router = useRouter()
  const intl = useIntl()
  const loginHint = useNativeLoginStore(({ loginHint }) => loginHint)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState<LoginErrorResult>()

  const onSubmit = async () => {
    setLoading(true)
    setFailure(undefined)
    const result = await startNativeLogin({ smsCode: code })
    setLoading(false)
    if ('next' in result) {
      if (result.next === 'confirm') {
        router.replace('/login/confirm')
      } else {
        // IAS sent a new code.
        setCode('')
      }
      return
    }
    if (result.error === 'smsCodeAttemptsUsed') {
      // Start again from the number.
      nativeLoginStore.setState({ error: result.error })
      router.back()
      return
    }
    setCode('')
    setFailure(result)
  }

  return (
    <LoginSmsCode
      phoneNumber={formatLoginHint('sim', loginHint)}
      codeLength={SMS_CODE_LENGTH}
      value={code}
      onChangeValue={(digits) => {
        setCode(digits)
        setFailure(undefined)
      }}
      onSubmit={onSubmit}
      onBackPress={() => router.back()}
      loading={loading}
      error={
        failure &&
        intl.formatMessage(
          {
            // Hermes has no Intl.PluralRules, so no ICU plurals.
            id:
              failure.error === 'wrongSmsCode' && failure.attemptsLeft === 1
                ? 'login.error.wrongSmsCodeLastAttempt'
                : loginErrorMessageId[failure.error],
          },
          { attemptsLeft: failure.attemptsLeft },
        )
      }
    />
  )
}
