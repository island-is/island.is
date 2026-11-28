import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import illustration from '@/assets/illustrations/onboarding-privacy.png'
import { DebugInfo } from '@/components/testing/debug-info'
import { isTestingApp } from '@/config'
import { Button, token, Typography } from '@/ui'
import { LoginHeader } from './login-header'

const Root = styled.View`
  flex: 1;
  background-color: ${token((t) => t.background.invert)};
`

const Host = styled(SafeAreaView)`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

// Scrolls only when it doesn't fit, e.g. with very large text on a small
// phone: the login button, the only way on, stays reachable.
const Content = styled.ScrollView``

const Heading = styled.View`
  margin-top: ${({ theme }) => theme.spacing[6]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const Spacer = styled.View`
  flex: 1;
`

const IllustrationWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-vertical: ${({ theme }) => theme.spacing[3]}px;
`

// The design's size at most, smaller when the screen is short.
const Illustration = styled.Image`
  width: 100%;
  height: 100%;
  max-width: 280px;
  max-height: 280px;
`

const Footer = styled.View`
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
`

// Weights map to font families, so the bold chunk has to go through
// Typography to pick up the semibold family.
const bold = {
  b: (chunks: React.ReactNode[]) => (
    <Typography variant="body2" weight="600">
      {chunks}
    </Typography>
  ),
}

interface ReloginNoticeProps {
  /**
   * The environment and Cognito settings, in place of the illustration.
   * On in the testing app.
   */
  showDebugInfo?: boolean
  onLoginPress(): void
}

/**
 * The login screen for someone who was logged in with an older version and
 * used a PIN: they have to log in again with electronic ID. Shown until they
 * do; there is deliberately nothing to dismiss.
 */
export function ReloginNotice({
  showDebugInfo = isTestingApp,
  onLoginPress,
}: ReloginNoticeProps) {
  const intl = useIntl()

  return (
    <Root>
      {/* The debug panel handles the bottom inset itself. */}
      <Host edges={showDebugInfo ? ['top'] : ['top', 'bottom']}>
        <LoginHeader />
        <Content
          contentContainerStyle={{ flexGrow: 1 }}
          alwaysBounceVertical={false}
        >
          <Heading>
            <Typography variant="heading2" textAlign="center">
              {intl.formatMessage({ id: 'relogin.title' })}
            </Typography>
            <Typography variant="body2" textAlign="center">
              <FormattedMessage id="relogin.body" values={bold} />
            </Typography>
            <Typography variant="body2" textAlign="center">
              {intl.formatMessage({ id: 'relogin.description' })}
            </Typography>
          </Heading>
          {showDebugInfo ? (
            <Spacer />
          ) : (
            <IllustrationWrapper>
              <Illustration source={illustration} resizeMode="contain" />
            </IllustrationWrapper>
          )}
          <Footer>
            <Button
              title={intl.formatMessage({ id: 'relogin.loginButton' })}
              onPress={onLoginPress}
            />
          </Footer>
        </Content>
      </Host>
      {showDebugInfo && <DebugInfo />}
    </Root>
  )
}
