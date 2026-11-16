import React from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import logo from '@/assets/logo/logo-64w.png'
import { Button, LinkText, LoadingDots, token, Typography } from '@/ui'

const Host = styled(SafeAreaView)`
  flex: 1;
  background-color: ${token((t) => t.background.invert)};
`

const Logo = styled.Image`
  width: 40px;
  height: 40px;
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Content = styled.View`
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-top: ${({ theme }) => theme.spacing[3]}px;
`

const Title = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const CodeBox = styled.View`
  align-self: stretch;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[5]}px;
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  background-color: ${token((t) => t.background.brandMinimal)};
`

const Dots = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing[3]}px;
`

const Instructions = styled(Typography)`
  max-width: 300px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const Footer = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
`

interface ElectronicIdConfirmationProps {
  /**
   * What the person is confirming: logging in, opening the app, or turning
   * on biometrics (which then names `biometricType`). Login is a full
   * screen; the others are shown in a sheet.
   */
  purpose: 'login' | 'unlock' | 'enableBiometrics'
  biometricType?: string
  /** The code the person compares against the one on their phone. */
  verificationCode: string
  onCancelPress(): void
  /** Shows the link to confirm in the Auðkenni app instead. */
  onAuthenticatorAppPress?(): void
}

/**
 * Shown while the person approves an electronic ID request on their phone.
 * The caller does the waiting; this only shows the code and a way out.
 */
export function ElectronicIdConfirmation({
  purpose,
  biometricType,
  verificationCode,
  onCancelPress,
  onAuthenticatorAppPress,
}: ElectronicIdConfirmationProps) {
  const intl = useIntl()
  const theme = useTheme()
  const isFullScreen = purpose === 'login'

  return (
    <Host edges={isFullScreen ? ['top', 'bottom'] : ['bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Content>
          {isFullScreen ? (
            <Logo source={logo} resizeMode="contain" />
          ) : (
            <Typography
              variant="body3"
              weight="600"
              color={theme.tokens.foreground.brand}
              textAlign="center"
            >
              {intl.formatMessage({ id: 'electronicId.eyebrow' })}
            </Typography>
          )}
          <Title variant="heading2" textAlign="center">
            {intl.formatMessage({ id: 'electronicId.title' })}
          </Title>
          <Typography textAlign="center">
            {purpose === 'enableBiometrics'
              ? intl.formatMessage(
                  { id: 'electronicId.subtitle.enableBiometrics' },
                  { biometricType },
                )
              : intl.formatMessage({
                  id:
                    purpose === 'login'
                      ? 'electronicId.subtitle.login'
                      : 'electronicId.subtitle.unlock',
                })}
          </Typography>
          <CodeBox
            accessible
            accessibilityLiveRegion="polite"
            // Read digit by digit, not as "four thousand seven hundred…".
            accessibilityLabel={`${intl.formatMessage({
              id: 'electronicId.codeLabel',
            })}: ${verificationCode.split('').join(' ')}`}
          >
            <Typography variant="body2">
              {intl.formatMessage({ id: 'electronicId.codeLabel' })}
            </Typography>
            <Typography variant="heading2">{verificationCode}</Typography>
          </CodeBox>
          <Dots>
            <LoadingDots />
          </Dots>
          <Instructions variant="body3" textAlign="center">
            {intl.formatMessage({ id: 'electronicId.instructions' })}
          </Instructions>
          {onAuthenticatorAppPress && (
            <TouchableOpacity
              onPress={onAuthenticatorAppPress}
              accessibilityRole="link"
            >
              <LinkText variant="small">
                {intl.formatMessage({ id: 'electronicId.useAuthenticatorApp' })}
              </LinkText>
            </TouchableOpacity>
          )}
        </Content>
      </ScrollView>
      <Footer>
        <Button
          isOutlined
          title={intl.formatMessage({ id: 'electronicId.cancel' })}
          onPress={onCancelPress}
        />
      </Footer>
    </Host>
  )
}
