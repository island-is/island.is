import React from 'react'
import { useIntl } from 'react-intl'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { Alert, Button, TextField, token, Typography } from '@/ui'
import { LoginHeader } from './login-header'

const Host = styled(SafeAreaView)`
  flex: 1;
  background-color: ${token((t) => t.background.invert)};
`

const Content = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const Heading = styled.View`
  margin-top: ${({ theme }) => theme.spacing[4]}px;
  margin-bottom: ${({ theme }) => theme.spacing[3]}px;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

interface LoginSmsCodeProps {
  /** Formatted for display, e.g. "868-1234" */
  phoneNumber: string
  codeLength: number
  /** Digits only */
  value: string
  onChangeValue(digits: string): void
  onSubmit(): void
  onBackPress(): void
  loading?: boolean
  error?: string
}

/**
 * The SMS code IAS sends before a SIM login on a new device. Not designed
 * yet: the copy follows IAS's own web page for this step.
 */
export function LoginSmsCode({
  phoneNumber,
  codeLength,
  value,
  onChangeValue,
  onSubmit,
  onBackPress,
  loading,
  error,
}: LoginSmsCodeProps) {
  const intl = useIntl()

  return (
    <Host>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Content>
          <LoginHeader onBackPress={onBackPress} />
          <Heading>
            <Typography variant="heading2" textAlign="center">
              {intl.formatMessage({ id: 'login.smsCode.title' })}
            </Typography>
            <Typography textAlign="center">
              {intl.formatMessage(
                { id: 'login.smsCode.subtitle' },
                { phoneNumber },
              )}
            </Typography>
          </Heading>
          <TextField
            label={intl.formatMessage({ id: 'login.smsCode.label' })}
            value={value}
            onChange={(text) =>
              onChangeValue(text.replace(/\D/g, '').slice(0, codeLength))
            }
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            autoFocus
            editable={!loading}
          />
          {error && (
            <Alert type="error" size="small" hasBorder message={error} />
          )}
          <Button
            title={intl.formatMessage({ id: 'login.smsCode.submit' })}
            onPress={onSubmit}
            disabled={value.length !== codeLength || loading}
            loading={loading}
          />
          <Typography variant="body3" textAlign="center">
            {intl.formatMessage({ id: 'login.smsCode.next' })}
          </Typography>
        </Content>
      </ScrollView>
    </Host>
  )
}
