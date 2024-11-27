import React from 'react'
import { FormattedDate } from 'react-intl'
import { Image, ImageSourcePropType, View, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import timeOutlineIcon from '../../assets/card/time-outline.png'
import { dynamicColor } from '../../utils/dynamic-color'
import { Typography } from '../typography/typography'
import { useOrganizationsStore } from '../../../stores/organizations-store'
import { ProgressMeter } from '../progress-meter/progress-meter'

const Host = styled.View`
  min-height: 180px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade300,
      light: theme.color.blue200,
    }),
    true,
  )};
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const ActionsContainer = styled.View`
  justify-content: center;
  align-items: center;
  border-top-width: ${({ theme }) => theme.border.width.standard}px;
  border-top-color: ${dynamicColor(
    (props) => ({
      light: props.theme.color.blue200,
      dark: 'shade300',
    }),
    true,
  )};
  flex-direction: row;
`

const ActionButton = styled.TouchableOpacity<{ border: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-left-width: ${({ theme }) => theme.border.width.standard}px;
  border-left-color: ${dynamicColor(
    ({ theme, border }) => (!border ? 'transparent' : theme.color.blue200),
    true,
  )};
`

const Title = styled.View`
  flex-direction: row;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
  align-items: center;
`

const Content = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]}px;
  padding-top: 0;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]}px;
`

interface StatusCardProps {
  title: string
  description?: string
  date: Date
  badge?: React.ReactNode
  progress?: number
  progressTotalSteps?: number
  progressMessage?: string
  progressContainerWidth?: number
  institution?: string
  actions: Array<{ text: string; onPress(): void }>
  style?: ViewStyle
}

export function StatusCard({
  title,
  description,
  date,
  badge,
  progress,
  actions = [],
  style,
  institution,
  progressTotalSteps,
  progressMessage,
  progressContainerWidth,
}: StatusCardProps) {
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  const icon = getOrganizationLogoUrl(institution ?? '')
  const theme = useTheme()

  const hideProgress = !progress && !progressTotalSteps

  return (
    <Host style={style}>
      <Row>
        <Date>
          <Image
            source={timeOutlineIcon as ImageSourcePropType}
            style={{
              width: 16,
              height: 16,
              marginRight: theme.spacing.smallGutter,
            }}
          />
          <Typography variant="body3">
            <FormattedDate value={date} />
          </Typography>
        </Date>
        {badge}
      </Row>
      <Content>
        <Title>
          <Image
            source={icon}
            style={{ width: 24, height: 24, marginRight: theme.spacing[1] }}
          />
          <Typography variant="heading5" style={{ flexShrink: 1 }}>
            {title}
          </Typography>
        </Title>
        {!!description && <Typography>{description}</Typography>}
        {!hideProgress && (
          <ProgressMeter
            finishedSteps={progress ?? 0}
            totalSteps={progressTotalSteps ?? 0}
            progressMessage={progressMessage}
            containerWidth={progressContainerWidth}
          />
        )}
      </Content>
      <View style={{ flex: 1 }} />
      {actions.length ? (
        <ActionsContainer>
          {actions.map(({ text, onPress }, i) => (
            <ActionButton onPress={onPress} key={i} border={i !== 0}>
              <Typography variant="heading5" color={theme.color.blue400}>
                {text}
              </Typography>
            </ActionButton>
          ))}
        </ActionsContainer>
      ) : null}
    </Host>
  )
}
