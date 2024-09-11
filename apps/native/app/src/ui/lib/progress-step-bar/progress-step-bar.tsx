import * as React from 'react'
import { View } from 'react-native'
import { screenWidth } from '../../../utils/dimensions'
import styled, { useTheme } from 'styled-components/native'
import { Typography } from '../typography/typography'

export type DraftProgressMeterVariant = 'blue' | 'red' | 'rose' | 'mint'

type DraftProgressMeterProps = {
  variant?: DraftProgressMeterVariant
  className?: string
  draftTotalSteps: number
  draftFinishedSteps: number
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

export const DraftProgressMeter: React.FC<
  React.PropsWithChildren<DraftProgressMeterProps>
> = ({
  draftFinishedSteps,
  draftTotalSteps,
  progressMessage,
  variant = 'blue',
}) => {
  const theme = useTheme()
  const steps = Array.from(Array(draftTotalSteps ?? 1).keys())

  // TODO what happens if draftTotalSteps is 0?
  const stepWidth =
    (screenWidth -
      theme.spacing[2] * 4 -
      theme.spacing.smallGutter * 2 -
      draftTotalSteps * theme.spacing.smallGutter) /
    draftTotalSteps
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
                  draftFinishedSteps > i
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
