import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  DimensionValue,
  Image,
  ScrollView,
  View,
  ViewStyle,
} from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import illustrationSrc from '@/assets/illustrations/health-messages-intro.png'
import { Button, Checkbox, Skeleton, Typography } from '@/ui'

// Less room than this and the illustration is dropped rather than squeezed.
const MIN_ILLUSTRATION_HEIGHT = 96

const SKELETON_LINE_HEIGHT = 16
const SKELETON_LINE_RADIUS = 8
// The illustration's own bounds, and the button's padding plus line height.
const ILLUSTRATION_WIDTH = 153
const ILLUSTRATION_HEIGHT = 183
const BUTTON_HEIGHT = 48
// Smaller than the illustration: at full size it reads as content, not as
// waiting.
const ILLUSTRATION_SKELETON_SIZE = 120

// Stands in for the intro copy while the recipients load.
const IntroCopySkeleton = () => {
  const theme = useTheme()

  // Stretched: percent widths resolve against zero in a group that hugs its
  // lines.
  const paragraphStyle: ViewStyle = {
    alignSelf: 'stretch',
    alignItems: 'center',
    rowGap: theme.spacing.smallGutter,
  }

  const line = (width: DimensionValue) => (
    <Skeleton
      active
      height={SKELETON_LINE_HEIGHT}
      style={{ width, borderRadius: SKELETON_LINE_RADIUS }}
    />
  )

  return (
    <View style={{ alignItems: 'center', rowGap: theme.spacing[2] }}>
      <Skeleton
        active
        height={24}
        style={{ width: '60%', borderRadius: SKELETON_LINE_RADIUS }}
      />
      {/* The line counts the Icelandic copy wraps to on a form sheet. */}
      <View style={paragraphStyle}>
        {line('95%')}
        {line('90%')}
        {line('60%')}
      </View>
      <View style={paragraphStyle}>
        {line('95%')}
        {line('90%')}
        {line('70%')}
      </View>
      {line('45%')}
    </View>
  )
}

interface HealthMessageIntroProps {
  termsAccepted: boolean
  onToggleTerms: () => void
  onContinue: () => void
  /** Recipients still loading: the copy is a skeleton and the step is a
   * dead end until they arrive. */
  loading?: boolean
}

/**
 * First step of composing a new health message: what the service is, when to
 * call instead, and the consent that has to be given before the form opens.
 */
export const HealthMessageIntro = ({
  termsAccepted,
  onToggleTerms,
  onContinue,
  loading = false,
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
          {loading ? (
            <IntroCopySkeleton />
          ) : (
            <>
              <Typography variant="heading2" textAlign="center">
                {intl.formatMessage({
                  id: 'health.messages.compose.introTitle',
                })}
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
            </>
          )}
        </View>
        {showIllustration ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              // The consent is out while loading, so the box sits under the
              // copy rather than centred in the empty slot.
              ...(loading && { paddingTop: theme.spacing[7] }),
            }}
          >
            {loading ? (
              <Skeleton
                active
                height={ILLUSTRATION_SKELETON_SIZE}
                style={{
                  width: ILLUSTRATION_SKELETON_SIZE,
                  borderRadius: 16,
                }}
              />
            ) : (
              <Image
                source={illustrationSrc}
                style={{
                  flex: 1,
                  maxWidth: ILLUSTRATION_WIDTH,
                  maxHeight: ILLUSTRATION_HEIGHT,
                }}
                resizeMode="contain"
              />
            )}
          </View>
        ) : (
          // Soaks up the slack the illustration would have, so the consent
          // sits with the button instead of floating mid-step.
          <View style={{ flex: 1 }} />
        )}
        {/* Nothing to consent to until it is known the form can open. */}
        {!loading && (
          <View onLayout={(e) => setConsentHeight(e.nativeEvent.layout.height)}>
            <Checkbox
              checked={termsAccepted}
              onPress={onToggleTerms}
              label={intl.formatMessage({
                id: 'health.messages.compose.termsAccept',
              })}
            />
          </View>
        )}
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
        {loading ? (
          <Skeleton
            active
            height={BUTTON_HEIGHT}
            style={{ borderRadius: SKELETON_LINE_RADIUS }}
          />
        ) : (
          <Button
            title={intl.formatMessage({
              id: 'health.messages.compose.continue',
            })}
            onPress={onContinue}
            disabled={!termsAccepted}
          />
        )}
      </View>
    </View>
  )
}
