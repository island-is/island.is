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
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

const Divider = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const Line = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${token((t) => t.border.primary)};
`

/**
 * - `sim`: electronic ID on the phone, found by phone number
 * - `app`: the Auðkenni app, found by kennitala
 */
export type LoginMethod = 'sim' | 'app'

/** How many digits IAS expects as the login hint for each method */
export const loginHintLength: Record<LoginMethod, number> = {
  sim: 7,
  app: 10,
}

// 8681234 → "868 1234", 0101302989 → "010130-2989"
function formatLoginHint(method: LoginMethod, digits: string) {
  const [split, separator] = method === 'sim' ? [3, ' '] : [6, '-']
  if (digits.length <= split) {
    return digits
  }
  return `${digits.slice(0, split)}${separator}${digits.slice(split)}`
}

interface LoginIdentifierProps {
  method: LoginMethod
  /** Digits only */
  value: string
  onChangeValue(digits: string): void
  onSubmit(): void
  onSwitchMethod(): void
  onBackPress(): void
  loading?: boolean
  error?: string
}

/**
 * Where the person says who they are, before IAS sends the electronic ID
 * request to their phone.
 */
export function LoginIdentifier({
  method,
  value,
  onChangeValue,
  onSubmit,
  onSwitchMethod,
  onBackPress,
  loading,
  error,
}: LoginIdentifierProps) {
  const intl = useIntl()
  const isComplete = value.length === loginHintLength[method]

  return (
    <Host>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Content>
          <LoginHeader onBackPress={onBackPress} />
          <Heading>
            <Typography variant="heading2" textAlign="center">
              {intl.formatMessage({ id: 'login.identifier.title' })}
            </Typography>
            <Typography textAlign="center">
              {intl.formatMessage({
                id:
                  method === 'sim'
                    ? 'login.identifier.subtitle.sim'
                    : 'login.identifier.subtitle.app',
              })}
            </Typography>
          </Heading>
          <TextField
            // Remount so autoFocus and the keyboard type follow the method.
            key={method}
            label={intl.formatMessage({
              id:
                method === 'sim'
                  ? 'login.identifier.phoneLabel'
                  : 'login.identifier.nationalIdLabel',
            })}
            value={formatLoginHint(method, value)}
            onChange={(text) =>
              onChangeValue(
                text.replace(/\D/g, '').slice(0, loginHintLength[method]),
              )
            }
            keyboardType="number-pad"
            textContentType={method === 'sim' ? 'telephoneNumber' : 'none'}
            autoComplete={method === 'sim' ? 'tel' : 'off'}
            autoFocus
            editable={!loading}
          />
          {error && (
            <Alert type="error" size="small" hasBorder message={error} />
          )}
          <Button
            title={intl.formatMessage({ id: 'login.identifier.submit' })}
            onPress={onSubmit}
            disabled={!isComplete || loading}
            loading={loading}
          />
          <Divider>
            <Line />
            <Typography variant="body3">
              {intl.formatMessage({ id: 'login.identifier.or' })}
            </Typography>
            <Line />
          </Divider>
          <Button
            isOutlined
            title={intl.formatMessage({
              id:
                method === 'sim'
                  ? 'login.identifier.useApp'
                  : 'login.identifier.useSim',
            })}
            onPress={onSwitchMethod}
            disabled={loading}
          />
        </Content>
      </ScrollView>
    </Host>
  )
}
