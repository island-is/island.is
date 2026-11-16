import React from 'react'
import { useIntl } from 'react-intl'
import { ImageSourcePropType, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import fallbackIllustration from '@/assets/illustrations/digital-services-m2.png'
import { DebugInfo } from '@/components/testing/debug-info'
import { isTestingApp } from '@/config'
import { useBrowser } from '@/hooks/use-browser'
import { usePreferencesStore } from '@/stores/preferences-store'
import { Button, LinkText, token, Typography } from '@/ui'
import { testIDs } from '@/utils/test-ids'
import { HeaderTextButton, LoginHeader } from './login-header'

const links = {
  is: {
    terms: 'https://island.is/s/stafraent-island/stefnur-skilmalar-og-vidmid',
    help: 'https://island.is/adstod',
  },
  en: {
    terms:
      'https://island.is/en/o/digital-iceland/policies-terms-and-guidelines-digital-iceland',
    help: 'https://island.is/en/help',
  },
}

const Root = styled.View`
  flex: 1;
  background-color: ${token((t) => t.background.invert)};
`

const Host = styled(SafeAreaView)`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const Spacer = styled.View`
  flex: 1;
`

const Title = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing[9]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
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
  max-width: 318px;
  max-height: 362px;
`

const Footer = styled.View`
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const Links = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]}px;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

interface LoginWelcomeProps {
  /** The front-page image from the CMS. Falls back to a bundled one. */
  illustration?: ImageSourcePropType
  /**
   * The environment and Cognito settings, in place of the illustration.
   * On in the testing app.
   */
  showDebugInfo?: boolean
  onLoginPress(): void
  onLanguagePress(): void
}

/**
 * The first screen for someone who isn't logged in.
 */
export function LoginWelcome({
  illustration = fallbackIllustration,
  showDebugInfo = isTestingApp,
  onLoginPress,
  onLanguagePress,
}: LoginWelcomeProps) {
  const intl = useIntl()
  const theme = useTheme()
  const { openBrowser } = useBrowser()
  // Same split as the messages: anything but Icelandic gets English.
  const locale = usePreferencesStore(({ locale }) => locale)
  const { terms, help } = links[locale === 'is-IS' ? 'is' : 'en']

  return (
    <Root testID={testIDs.SCREEN_LOGIN}>
      {/* The debug panel handles the bottom inset itself. */}
      <Host edges={showDebugInfo ? ['top'] : ['top', 'bottom']}>
        <LoginHeader
          right={
            <HeaderTextButton
              onPress={onLanguagePress}
              accessibilityRole="button"
            >
              <Typography
                variant="body2"
                weight="600"
                color={theme.tokens.interactive.foreground.primary}
              >
                {intl.formatMessage({ id: 'login.languageButtonText' })}
              </Typography>
            </HeaderTextButton>
          }
        />
        <Title variant="heading1" textAlign="center">
          {intl.formatMessage({ id: 'login.welcome.title' })}
        </Title>
        {showDebugInfo ? (
          <Spacer />
        ) : (
          <IllustrationWrapper>
            <Illustration source={illustration} resizeMode="contain" />
          </IllustrationWrapper>
        )}
        <Footer>
          <Button
            title={intl.formatMessage({ id: 'login.welcome.loginButton' })}
            testID={testIDs.LOGIN_BUTTON_AUTHENTICATE}
            onPress={onLoginPress}
          />
          <Links>
            <TouchableOpacity
              onPress={() => openBrowser(terms)}
              accessibilityRole="link"
            >
              <LinkText variant="small">
                {intl.formatMessage({ id: 'login.welcome.terms' })}
              </LinkText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openBrowser(help)}
              accessibilityRole="link"
            >
              <LinkText variant="small">
                {intl.formatMessage({ id: 'login.welcome.help' })}
              </LinkText>
            </TouchableOpacity>
          </Links>
        </Footer>
      </Host>
      {showDebugInfo && <DebugInfo />}
    </Root>
  )
}
