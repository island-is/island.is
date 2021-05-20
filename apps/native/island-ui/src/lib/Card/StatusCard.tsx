import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import { FormattedDate } from 'react-intl'
import { Image, ImageSourcePropType, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import timeOutlineIcon from '../../assets/card/time-outline.png'

const Host = styled.View`
  width: 100%;
  border-radius: ${theme.border.radius.large};
  border-width: 1px;
  border-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade300
      : props.theme.color.blue200};
  margin-bottom: 16px;
`

const ActionsContainer = styled.View`
  border-top-width: 1px;
  border-top-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade300
      : props.theme.color.blue200};
  flex-direction: row;
`

const ActionButton = styled.TouchableOpacity<{ border: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-left-width: 1px;
  border-left-color: ${(props) =>
    props.border ? props.theme.color.blue200 : 'transparent'};
`

const ActionText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${theme.color.blue400};
  text-align: center;
`

const Title = styled.Text`
  margin-bottom: 8px;
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
`

const Description = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.shade.foreground};
`

const Content = styled.View`
  padding: 16px;
  padding-top: 0px;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const DateText = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
`

const Bar = styled.View`
  height: 12px;
  overflow: hidden;
  background-color: ${(props) =>
    props.theme.isDark ? theme.color.roseTinted600 : theme.color.roseTinted200};
  border-radius: 6px;
  padding: 2px;

  margin-top: 16px;
`

const Progress = styled.View<{ width?: number }>`
  flex: 1;
  width: ${(props: any) => props.width ?? 0}%;
  border-radius: 6px;

  background-color: ${theme.color.roseTinted400};
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
