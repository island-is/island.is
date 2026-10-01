import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, ScrollView, View } from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import illustrationSrc from '@/assets/illustrations/health-messages-intro.png'
import { Button, Checkbox, Typography } from '@/ui'

// Less room than this and the illustration is dropped rather than squeezed.
const MIN_ILLUSTRATION_HEIGHT = 96

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
  // Not useSafeAreaInsets: inside the tabs it reports the tab bar height (83pt
  // on an SE), which this sheet covers. Only the home indicator needs clearing.
  const homeIndicatorInset = initialWindowMetrics?.insets.bottom ?? 0
  const [viewportHeight, setViewportHeight] = useState(0)
  const [copyHeight, setCopyHeight] = useState(0)
  const [consentHeight, setConsentHeight] = useState(0)

  // The checkbox is the only way on, so it gets its space first and the
  // illustration takes the rest. Measured, not a window-height threshold: this
  // is a form sheet, and the copy grows with locale and text size.
  const gaps = theme.spacing[2] * 3
  const spareHeight = viewportHeight - copyHeight - consentHeight - gaps
  const showIllustration = spareHeight >= MIN_ILLUSTRATION_HEIGHT

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
        onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: theme.spacing[2],
          paddingBottom: theme.spacing[1],
          rowGap: theme.spacing[2],
        }}
      >
        <View
          style={{ rowGap: theme.spacing[2] }}
          onLayout={(e) => setCopyHeight(e.nativeEvent.layout.height)}
        >
          <Typography variant="heading2" textAlign="center">
            {intl.formatMessage({ id: 'health.messages.compose.introTitle' })}
          </Typography>
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
        {showIllustration ? (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              source={illustrationSrc}
              style={{ flex: 1, maxWidth: 153, maxHeight: 183 }}
              resizeMode="contain"
            />
          </View>
        ) : (
          // Soaks up the slack the illustration would have, so the consent
          // sits with the button instead of floating mid-step.
          <View style={{ flex: 1 }} />
        )}
        <View onLayout={(e) => setConsentHeight(e.nativeEvent.layout.height)}>
          <Checkbox
            checked={termsAccepted}
            onPress={onToggleTerms}
            label={intl.formatMessage({
              id: 'health.messages.compose.termsAccept',
            })}
          />
        </View>
      </ScrollView>
      {/* Pinned so the consent action stays reachable without scrolling. The
          bottom inset is applied here rather than on a SafeAreaView wrapper,
          so devices without one (Android 3-button nav) still get a gap. */}
      <View
        style={{
          paddingHorizontal: theme.spacing[2],
          paddingTop: theme.spacing[1],
          paddingBottom: Math.max(homeIndicatorInset, theme.spacing[3]),
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
