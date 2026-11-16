import React from 'react'
import { View } from 'react-native'
import { screenWidth } from '../../../utils/dimensions'
import styled, { useTheme } from 'styled-components/native'
import { TokenSelector } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.View`
  border-radius: ${({ theme: { border } }) => border.radius.extraLarge};
  height: 16px;
  padding: ${({ theme }) => theme.spacing.smallGutter}px;
  margin-top: ${({ theme }) => theme.spacing[1]}px;
`

const InnerHost = styled.View`
  flex: 1;
  flex-direction: row;
  column-gap: ${({ theme }) => theme.spacing.smallGutter}px;
  border-radius: ${({ theme: { border } }) => border.radius.large};
  height: 100%;
`

export type ProgressMeterVariant = 'blue' | 'red' | 'rose' | 'mint'

interface ProgressMeterProps {
  totalSteps: number
  finishedSteps: number
  containerWidth?: number
  variant?: ProgressMeterVariant
  progressMessage?: string
}

const colorSchemes: Record<
  ProgressMeterVariant,
  { unfinished: TokenSelector; outer: TokenSelector; inner: TokenSelector }
> = {
  blue: {
    unfinished: (t) => t.feedback.information.border,
    outer: (t) => t.feedback.information.backgroundMinimal,
    inner: (t) => t.feedback.information.foreground,
  },
  red: {
    unfinished: (t) => t.feedback.error.border,
    outer: (t) => t.feedback.error.background,
    inner: (t) => t.feedback.error.foreground,
  },
  rose: {
    unfinished: (t) => t.feedback.tags.rose.border,
    outer: (t) => t.feedback.tags.rose.background,
    inner: (t) => t.feedback.tags.rose.accent,
  },
  mint: {
    unfinished: (t) => t.feedback.success.border,
    outer: (t) => t.feedback.success.background,
    inner: (t) => t.app.foreground.successContrast,
  },
}

export const ProgressMeter = ({
  finishedSteps,
  totalSteps,
  progressMessage,
  containerWidth,
  variant = 'blue',
}: ProgressMeterProps) => {
  const theme = useTheme()
  const colours = colorSchemes[variant]
  const steps = Array.from(Array(totalSteps ?? 1).keys())
  const allowedWidth = containerWidth ?? screenWidth - theme.spacing[2] * 4

  if (!totalSteps) {
    return
  }
  // Take into account padding in each end and between each step
  const stepWidth =
    (allowedWidth -
      theme.spacing.smallGutter * 2 -
      totalSteps * theme.spacing.smallGutter) /
    totalSteps

  return (
    <>
      <Host style={{ backgroundColor: colours.outer(theme.tokens) }}>
        <InnerHost>
          {steps.map((i) => (
            <View
              style={{
                backgroundColor:
                  finishedSteps > i
                    ? colours.inner(theme.tokens)
                    : colours.unfinished(theme.tokens),
                borderRadius: 8,
                width: stepWidth,
              }}
              key={`draft-progress-meter-${i}`}
            />
          ))}
        </InnerHost>
      </Host>
      <View style={{ marginTop: theme.spacing[1] }}>
        <Typography variant="body3" color={theme.tokens.foreground.brand}>
          {progressMessage}
        </Typography>
      </View>
    </>
  )
}
