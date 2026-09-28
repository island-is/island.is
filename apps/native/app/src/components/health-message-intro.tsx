import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, ScrollView, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import illustrationSrc from '@/assets/illustrations/health-messages-intro.png'
import { Button, Checkbox, Typography } from '@/ui'

// The illustration is the first thing dropped on short devices, matching the
// passkey modal.
const MIN_HEIGHT_FOR_ILLUSTRATION = 650

interface HealthMessageIntroProps {
  termsAccepted: boolean
  onToggleTerms: () => void
  onContinue: () => void
}

/**
 * First step of composing a new health message: what the service is, when to
 * call instead, and the consent that has to be given before the form opens.
 */
export const HealthMessageIntro = ({
  termsAccepted,
  onToggleTerms,
  onContinue,
}: HealthMessageIntroProps) => {
  const intl = useIntl()
  const theme = useTheme()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  // Weights map to font families here, so a bare `fontWeight` on a nested Text
  // would keep the inherited light face — the chunk has to go through
  // Typography to pick up the semibold family.
  const bold = {
    b: (chunks: React.ReactNode[]) => (
      <Typography weight="600">{chunks}</Typography>
    ),
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: theme.spacing[2],
          paddingBottom: theme.spacing[2],
          rowGap: theme.spacing[2],
        }}
      >
        <Typography variant="heading2" textAlign="center">
          {intl.formatMessage({ id: 'health.messages.compose.introTitle' })}
        </Typography>
        <View style={{ rowGap: theme.spacing[2] }}>
          <Typography textAlign="center">
            <FormattedMessage id="health.messages.compose.introBody1" />
          </Typography>
          <Typography textAlign="center">
            <FormattedMessage
              id="health.messages.compose.introBody2"
              values={bold}
            />
          </Typography>
          <Typography textAlign="center">
            <FormattedMessage
              id="health.messages.compose.introBody3"
              values={bold}
            />
          </Typography>
        </View>
        {height > MIN_HEIGHT_FOR_ILLUSTRATION && (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              source={illustrationSrc}
              style={{ flex: 1, maxWidth: 153, maxHeight: 183 }}
              resizeMode="contain"
            />
          </View>
        )}
        <Checkbox
          checked={termsAccepted}
          onPress={onToggleTerms}
          label={intl.formatMessage({
            id: 'health.messages.compose.termsAccept',
          })}
        />
      </ScrollView>
      {/* Pinned so the consent action stays reachable without scrolling. The
          bottom inset is applied here rather than on a SafeAreaView wrapper,
          so devices without one (Android 3-button nav) still get a gap. */}
      <View
        style={{
          paddingHorizontal: theme.spacing[2],
          paddingTop: theme.spacing[2],
          paddingBottom: Math.max(insets.bottom, theme.spacing[2]),
          backgroundColor: theme.color.white,
        }}
      >
        <Button
          title={intl.formatMessage({
            id: 'health.messages.compose.continue',
          })}
          onPress={onContinue}
          disabled={!termsAccepted}
        />
      </View>
    </View>
  )
}
