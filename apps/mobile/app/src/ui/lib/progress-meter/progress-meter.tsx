import React from 'react'
import { View } from 'react-native'
import { screenWidth } from '../../../utils/dimensions'
import styled, { useTheme } from 'styled-components/native'
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

const colorSchemes = {
  blue: {
    unfinished: 'blue200',
    outer: 'blue100',
    inner: 'blue400',
  },
  red: {
    unfinished: 'red200',
    outer: 'red100',
    inner: 'red400',
  },
  rose: {
    unfinished: 'roseTinted200',
    outer: 'roseTinted100',
    inner: 'roseTinted400',
  },
  mint: {
    unfinished: 'mint200',
    outer: 'mint100',
    inner: 'mint600',
  },
} as const

export const ProgressMeter = ({
  finishedSteps,
  totalSteps,
  progressMessage,
  containerWidth,
  variant = 'blue',
}: ProgressMeterProps) => {
  const theme = useTheme()
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
      <Host
        style={{ backgroundColor: theme.color[colorSchemes[variant].outer] }}
      >
        <InnerHost>
          {steps.map((i) => (
            <View
              style={{
                backgroundColor:
                  finishedSteps > i
                    ? theme.color[colorSchemes[variant].inner]
                    : theme.color[colorSchemes[variant].unfinished],
                borderRadius: 8,
                width: stepWidth,
              }}
              key={`draft-progress-meter-${i}`}
            />
          ))}
        </InnerHost>
      </Host>
      <View style={{ marginTop: theme.spacing[1] }}>
        <Typography variant="body3" color={theme.color.blue400}>
          {progressMessage}
        </Typography>
      </View>
    </>
  )
}
