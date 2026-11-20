import { router } from 'expo-router'
import { openBrowserAsync } from 'expo-web-browser'
import React from 'react'
import { useIntl } from 'react-intl'
import { Image, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import illustrationSrc from '@/assets/illustrations/health-messages-intro.png'
import externalLinkIcon from '@/assets/icons/external-link.png'
import { usePreferencesStore } from '@/stores/preferences-store'
import { Button, token, Typography } from '@/ui'

const privacyLinks = {
  is: 'https://island.is/s/stafraent-island/personuverndarstefna-island-is',
  en: 'https://island.is/en/o/digital-iceland/personuverndarstefna-island-is/digital-iceland-data-protection-policy',
}

const Illustration = styled(Image)`
  width: 153px;
  height: 183px;
  margin-bottom: ${({ theme }) => theme.spacing[3]}px;
`

const LinkRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
  padding-bottom: 2px;
  border-bottom-width: 1px;
  border-bottom-color: ${token((t) => t.interactive.border.borderPrimary)};
`

const LinkIcon = styled(Image)`
  width: 14px;
  height: 14px;
`

const Buttons = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

/**
 * Shown once when health data comes to the app: what's there, and that it
 * can be sensitive.
 */
export default function HealthIntroScreen() {
  const intl = useIntl()
  const theme = useTheme()
  const locale = usePreferencesStore(({ locale }) => locale)
  const privacyLink = privacyLinks[locale === 'is-IS' ? 'is' : 'en']

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingHorizontal: theme.spacing[3],
          paddingTop: theme.spacing[4],
          paddingBottom: theme.spacing[2],
          rowGap: theme.spacing[2],
        }}
      >
        <Illustration source={illustrationSrc} resizeMode="contain" />
        <Typography
          variant="heading2"
          textAlign="center"
          style={{ paddingHorizontal: theme.spacing[2] }}
        >
          {intl.formatMessage({ id: 'health.intro.title' })}
        </Typography>
        <Typography textAlign="center">
          {intl.formatMessage({ id: 'health.intro.body' })}
        </Typography>
        <Pressable
          onPress={() => openBrowserAsync(privacyLink)}
          accessibilityRole="link"
        >
          <LinkRow>
            <Typography
              weight="600"
              size={14}
              color={theme.tokens.interactive.foreground.primary}
            >
              {intl.formatMessage({ id: 'health.intro.privacyLink' })}
            </Typography>
            <LinkIcon source={externalLinkIcon} resizeMode="contain" />
          </LinkRow>
        </Pressable>
      </ScrollView>
      <Buttons>
        <Button
          title={intl.formatMessage({ id: 'health.intro.viewHealth' })}
          onPress={() => {
            router.back()
            router.navigate('/health')
          }}
        />
        <Button
          isOutlined
          title={intl.formatMessage({ id: 'health.intro.close' })}
          onPress={() => router.back()}
        />
      </Buttons>
    </SafeAreaView>
  )
}
