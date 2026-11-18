import React from 'react'
import { useIntl } from 'react-intl'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { Alert, Button, TabButtons, TextField, token, Typography } from '@/ui'
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

/**
 * - `sim`: electronic ID on the phone, found by phone number
 * - `app`: the Auðkenni app, found by kennitala
 */
export type LoginMethod = 'sim' | 'app'

// In the order of the tabs
const methods: LoginMethod[] = ['sim', 'app']

/** How many digits IAS expects as the login hint for each method */
export const loginHintLength: Record<LoginMethod, number> = {
  sim: 7,
  app: 10,
}

// 8681234 → "868-1234", 0101302989 → "010130-2989"
export function formatLoginHint(method: LoginMethod, digits: string) {
  const split = method === 'sim' ? 3 : 6
  if (digits.length <= split) {
    return digits
  }
  return `${digits.slice(0, split)}-${digits.slice(split)}`
}

interface LoginIdentifierProps {
  method: LoginMethod
  /** Digits only */
  value: string
  onChangeValue(digits: string): void
  onSubmit(): void
  onChangeMethod(method: LoginMethod): void
  loading?: boolean
  error?: string
  /** Bold, above the error */
  errorTitle?: string
  /** No network: said in place of the error, as the likely cause. */
  isOffline?: boolean
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
  onChangeMethod,
  loading,
  error,
  errorTitle,
  isOffline,
}: LoginIdentifierProps) {
  const intl = useIntl()
  const isComplete = value.length === loginHintLength[method]

  return (
    <Host>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Content>
          <LoginHeader />
          <Heading>
            <Typography variant="heading2" textAlign="center">
              {intl.formatMessage({ id: 'login.identifier.title' })}
            </Typography>
            <Typography textAlign="center">
              {intl.formatMessage({ id: 'login.identifier.subtitle' })}
            </Typography>
          </Heading>
          <TabButtons
            buttons={[
              {
                title: intl.formatMessage({
                  id: 'login.identifier.method.sim',
                }),
              },
              {
                title: intl.formatMessage({
                  id: 'login.identifier.method.app',
                }),
              },
            ]}
            selectedTab={methods.indexOf(method)}
            setSelectedTab={(index) => {
              if (methods[index] !== method) {
                onChangeMethod(methods[index])
              }
            }}
            disabled={loading}
          />
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
            placeholder={method === 'sim' ? '000-0000' : '000000-0000'}
            keyboardType="number-pad"
            textContentType={method === 'sim' ? 'telephoneNumber' : 'none'}
            autoComplete={method === 'sim' ? 'tel' : 'off'}
            autoFocus
            editable={!loading}
          />
          {isOffline ? (
            <Alert
              type="warning"
              size="small"
              hasBorder
              title={intl.formatMessage({ id: 'offline.title' })}
              message={intl.formatMessage({
                id: 'offline.loginMessage',
              })}
            />
          ) : (
            error && (
              <Alert
                type="error"
                size="small"
                hasBorder
                title={errorTitle}
                message={error}
              />
            )
          )}
          <Button
            title={intl.formatMessage({ id: 'login.identifier.submit' })}
            onPress={onSubmit}
            disabled={!isComplete || loading}
            loading={loading}
          />
        </Content>
      </ScrollView>
    </Host>
  )
}
