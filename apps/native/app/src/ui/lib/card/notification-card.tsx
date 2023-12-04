import React from 'react'
import { FormattedDate } from 'react-intl'
import { Image, ImageSourcePropType } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { dynamicColor } from '../../utils/dynamic-color'
import { font } from '../../utils/font'

const Host = styled.TouchableHighlight`
  border-radius: ${({ theme }) => theme.border.radius.large};
  background-color: ${dynamicColor((props) => ({
    dark: 'shade100',
    light: props.theme.color.blueberry100,
  }))};
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const Container = styled.View`
  padding-top: 20px;
`

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing[1]}px;
`

const ActionsContainer = styled.View`
  border-top-width: ${({ theme }) => theme.border.width.standard}px;
  border-top-color: ${dynamicColor(
    (props) => ({
      dark: 'shade200',
      light: props.theme.color.blueberry200,
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
    (props) => ({
      dark: !props.border ? 'transparent' : 'shade200',
      light: !props.border ? 'transparent' : props.theme.color.blueberry200,
    }),
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

const TitleText = styled.Text`
  flex: 1;

  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 17,
    color: 'foreground',
  })}
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
  padding-left: ${({ theme }) => theme.spacing[2]}px;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const DateText = styled.Text<{ unread?: boolean }>`
  ${font({
    fontWeight: (props) => (props.unread ? '600' : '300'),
    fontSize: 13,
    lineHeight: 17,
    color: 'foreground',
  })}
`

const Content = styled.View`
  padding-left: ${({ theme }) => theme.spacing[2]}px;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: 20px;
`

const Message = styled.Text`
  ${font({
    fontWeight: '300',
    color: 'foreground',
    lineHeight: 24,
  })}
`

const Dot = styled.View`
  width: ${({ theme }) => theme.spacing[1]}px;
  height: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  background-color: ${dynamicColor(({ theme }) => theme.color.blueberry400)};
  margin-left: ${({ theme }) => theme.spacing[1]}px;
`

interface CardProps {
  id: string
  icon: ImageSourcePropType
  category?: string
  date: Date
  title: string
  message: string
  unread?: boolean
  actions?: Array<{ text: string; onPress(): void }>
  onPress(id: string): void
}

export function NotificationCard({
  id,
  onPress,
  category,
  title,
  message,
  date,
  icon,
  unread,
  actions = [],
}: CardProps) {
  const theme = useTheme()
  return (
    <Host
      onPress={() => onPress(id)}
      underlayColor={theme.isDark ? theme.shade.shade200 : '#EBEBFA'}
    >
      <Container>
        <Row>
          <Title>
            {icon && (
              <Image
                source={icon}
                style={{ width: 16, height: 16, marginRight: 8 }}
              />
            )}
            <TitleText numberOfLines={1} ellipsizeMode="tail">
              {title}
            </TitleText>
          </Title>
          <Date>
            <DateText unread={unread}>
              <FormattedDate value={date} />
            </DateText>
            {unread && <Dot />}
          </Date>
        </Row>
        <Content>
          <Message>{message}</Message>
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
      </Container>
    </Host>
  )
}
