import React, { useState } from 'react'
import { FormattedDate } from 'react-intl'
import { Pressable, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import StarFilled from '../../../assets/icons/star-filled.png'
import Star from '../../../assets/icons/star.png'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'
import { theme } from '../../utils/theme'

const Host = styled.SafeAreaView<{ background?: boolean }>`
  margin-right: 16px;
  flex-direction: row;
  background-color: ${dynamicColor((props) =>
    props.background ? 'background' : 'transparent',
  )};
`

const Icon = styled.View`
  padding: 22px;
  align-items: center;
  justify-content: center;
`

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
  gap: 4px;
`

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing[1]}px;
`

const TitleText = styled.Text`
  flex: 1;
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 17,
    color: ({ theme }) => ({
      light: theme.color.dark400,
      dark: theme.shades.dark.foreground,
    }),
  })}
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
    color: ({ theme }) => ({
      light: theme.color.dark400,
      dark: theme.shades.dark.foreground,
    }),
  })}
`

const Dot = styled.View`
  width: ${({ theme }) => theme.spacing[1]}px;
  height: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.spacing[1]}px;
  background-color: ${dynamicColor(({ theme }) => theme.color.blueberry400)};
  margin-left: ${({ theme }) => theme.spacing[1]}px;
`

const Message = styled.Text`
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
  flex: 1;

  ${font({
    fontWeight: '300',
    lineHeight: 24,
    color: ({ theme }) => ({
      light: theme.color.dark400,
      dark: theme.shades.dark.foreground,
    }),
  })}
`

const Actions = styled.View`
  flex-direction: row;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Button = styled.TouchableHighlight`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  background-color: ${dynamicColor(({ theme }) => theme.color.blue400)};
  border-radius: ${({ theme }) => theme.spacing[1]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
`

const ButtonText = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: ({ theme }) => theme.color.white,
  })}
`

const Cell = styled.View``

const Divider = styled.View`
  background-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade100,
    light: theme.color.blue200,
  }))};
`

const StarImage = styled.Image<{ active?: boolean }>`
  tint-color: ${dynamicColor(({ active, theme }) => ({
    dark: active ? theme.color.blue400 : theme.color.dark300,
    light: active ? theme.color.blue400 : theme.color.dark300,
  }))};
  width: 16px;
  height: 16px;
  margin-top: -4px;
`

interface ListItemAction {
  id: string
  text: string
  onPress(props: ListItemAction): void
}

interface ListItemProps {
  title: string
  date: Date | string
  subtitle: string
  unread?: boolean
  actions?: ListItemAction[]
  icon?: React.ReactNode
  onStarPress?(): void
  starred?: boolean
}

export function ListItem({
  title,
  subtitle,
  date,
  icon,
  actions,
  onStarPress,
  starred = false,
  unread = false,
}: ListItemProps) {
  const [active, setActive] = useState(false)
  return (
    <Cell>
      <Host>
        {icon ? <Icon>{icon}</Icon> : null}
        <Content>
          <Row>
            <Title>
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
          <Row style={{ alignItems: 'center', paddingBottom: 0 }}>
            <Message numberOfLines={1}>{subtitle}</Message>
            <Pressable hitSlop={16} onPress={onStarPress}>
              <StarImage
                source={starred ? StarFilled : Star}
                active={starred}
              />
            </Pressable>
          </Row>
          {actions?.length ? (
            <Actions>
              {actions.map((action) => (
                <Button
                  key={action.id}
                  underlayColor={theme.color.blue600}
                  onPress={() => action.onPress(action)}
                >
                  <ButtonText>{action.text}</ButtonText>
                </Button>
              ))}
            </Actions>
          ) : null}
        </Content>
      </Host>
      <Divider style={{ height: StyleSheet.hairlineWidth }} />
    </Cell>
  )
}
