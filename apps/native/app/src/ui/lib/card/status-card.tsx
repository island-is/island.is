import React from 'react'
import { FormattedDate } from 'react-intl'
import { Image, ImageSourcePropType, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import timeOutlineIcon from '../../assets/card/time-outline.png'
import { dynamicColor } from '../../utils/dynamic-color'
import { font } from '../../utils/font'

const Host = styled.View`
  width: 100%;
  min-height: 160px;
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
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-left-width: ${({ theme }) => theme.border.width.standard}px;
  border-left-color: ${dynamicColor(
    ({ theme, border }) => (!border ? 'transparent' : theme.color.blue200),
    true,
  )};
`

const ActionText = styled.Text`
  ${font({
    fontWeight: '600',
    color: ({ theme }) => theme.color.blue400,
  })}
  text-align: center;
`

const Title = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;

  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 17,
  })}
`

const Description = styled.Text`
  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })}
`

const Content = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
  padding-top: 0px;
  flex: 1;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const DateText = styled.Text`
  ${font({
    fontWeight: '300',
    fontSize: 13,
    lineHeight: 17,
  })}
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]}px;
`

const Bar = styled.View`
  height: 12px;
  padding: 2px;
  overflow: hidden;
  background-color: ${dynamicColor(({ theme }) => ({
    dark: theme.color.roseTinted600,
    light: theme.color.roseTinted200,
  }))};
  border-radius: 6px;

  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const Progress = styled.View<{ width?: number }>`
  flex: 1;
  width: ${(props: any) => props.width ?? 0}%;
  border-radius: 6px;

  background-color: ${dynamicColor(({ theme }) => theme.color.roseTinted400)};
`

interface StatusCardProps {
  title: string
  description?: string
  date: Date
  badge?: React.ReactNode
  progress?: number
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
}: StatusCardProps) {
  return (
    <Host style={style as any}>
      <Row>
        <Date>
          <Image
            source={timeOutlineIcon as ImageSourcePropType}
            style={{ width: 16, height: 16, marginRight: 4 }}
          />
          <DateText>
            <FormattedDate value={date} />
          </DateText>
        </Date>
        {badge}
      </Row>
      <Content>
        <Title>{title}</Title>
        {!!description && <Description>{description}</Description>}
        <View style={{ flex: 1 }} />
        <Bar>
          <Progress width={progress} />
        </Bar>
      </Content>
      {actions.length ? (
        <ActionsContainer>
          {actions.map(({ text, onPress }, i) => (
            <ActionButton onPress={onPress} key={i} border={i !== 0}>
              <ActionText>{text}</ActionText>
            </ActionButton>
          ))}
        </ActionsContainer>
      ) : null}
    </Host>
  )
}
