import { theme } from '@island.is/island-ui/theme'
import { impactAsync, ImpactFeedbackStyle, selectionAsync } from 'expo-haptics'
import React, { useRef, useState } from 'react'
import { FormattedDate } from 'react-intl'
import { Animated, StyleSheet } from 'react-native'
import Interactable from 'react-native-interactable'
import styled from 'styled-components/native'
import checkmarkIcon from '../../assets/icons/checkmark.png'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.SafeAreaView<{ background: boolean }>`
  margin-right: 16px;
  flex-direction: row;
  background-color: ${dynamicColor((props) =>
    props.background ? 'background' : 'transparent')};
`

const Icon = styled.View`
  padding: 22px;
  align-items: center;
  justify-content: center;
`

const Logo = styled.Image`
  width: 24px;
  height: 24px;
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
    })
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
    })
  })}
`

const Dot = styled.View`
  width: ${({ theme }) => theme.spacing[1]}px;
  height: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.spacing[1]}px;
  background-color: ${({ theme }) => theme.color.blueberry400};
  margin-left: ${({ theme }) => theme.spacing[1]}px;
`

const Message = styled.Text`
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;

  ${font({
    fontWeight: '300',
    lineHeight: 24,
    color: ({ theme }) => ({
      light: theme.color.dark400,
      dark: theme.shades.dark.foreground,
    })
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
  background-color: ${({ theme }) => theme.color.blue400};
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
const Action = styled(Animated.View)`
  position: absolute;
  background-color: ${dynamicColor(props => ({
    dark: '#001333',
    light: props.theme.color.blue200
  }))};
  top: 0;
  right: 100%;
  bottom: 0;
  width: 100%;
`

const Checkmark = styled.Image`
  width: 32px;
  height: 32px;
`

const ActionPress = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  padding-right: 16px;
  padding-left: 16px;
  bottom: 0;
  top: 0;
  justify-content: center;
`

const Cell = styled.View``

const Divider = styled.View`
  background-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade100,
    light: theme.color.blue200
  }))};
`

interface ListItemAction {
  id: string
  text: string
  onPress(props: ListItemAction): any
}

interface ListItemProps {
  title: string
  date: Date | string
  subtitle: string
  unread?: boolean
  swipable?: boolean
  onToggleUnread?(): void
  actions?: ListItemAction[]
  icon?: React.ReactNode
}

export function ListItem({
  title,
  subtitle,
  date,
  icon,
  actions,
  swipable,
  onToggleUnread,
  unread = false,
}: ListItemProps) {
  const interactableRef = useRef<any>()
  const deltaX = useRef(new Animated.Value(0)).current
  const deltaY = useRef(new Animated.Value(0)).current
  const markOnRelease = useRef(false)
  const canMarkOnRelease = useRef(false)
  const offset = 64
  const [background, setBackground] = useState(false)

  const content = (
    <Host background={background}>
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
        <Message>{subtitle}</Message>
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
  )

  return (
    <Cell>
      {swipable ? (
        <>
          <Action
            style={{
              opacity: deltaX.interpolate({
                inputRange: [0, 2, offset],
                outputRange: [0, 0.5, 1],
              }),
              transform: [
                {
                  translateX: deltaX.interpolate({
                    inputRange: [0, offset, 1000],
                    outputRange: [offset, offset, 1000],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}
          >
            <ActionPress
              onPress={() => {
                onToggleUnread?.()
                interactableRef.current.snapTo({ index: 0 })
              }}
            >
              <Checkmark source={checkmarkIcon} />
            </ActionPress>
          </Action>
          <Interactable.View
            ref={interactableRef}
            horizontalOnly={true}
            snapPoints={[{ x: 0 }, { x: offset }]}
            alertAreas={[{ id: 'status', influenceArea: { left: offset * 3 } }]}
            boundaries={{
              left: 0,
            }}
            dragToss={0.01}
            animatedValueX={deltaX}
            animatedValueY={deltaY}
            animatedNativeDriver={true}
            onDrag={(e) => {
              const isStart = e.nativeEvent.state === 'start'
              canMarkOnRelease.current = isStart
              if (isStart) {
                setBackground(true)
                markOnRelease.current = false
              } else {
                if (markOnRelease.current) {
                  impactAsync(ImpactFeedbackStyle.Medium)
                  interactableRef.current.snapTo({ index: 0 })
                  onToggleUnread?.()
                }
              }
            }}
            onSnap={(e) => {
              if (e.nativeEvent.index === 0) {
                setBackground(false)
              }
            }}
            onAlert={(e) => {
              if (canMarkOnRelease.current) {
                if (e.nativeEvent?.status === 'enter') {
                  selectionAsync()
                  markOnRelease.current = true
                } else if (e.nativeEvent?.status === 'leave') {
                  selectionAsync()
                  markOnRelease.current = false
                }
              }
            }}
          >
            {content}
          </Interactable.View>
        </>
      ) : (
        content
      )}
      <Divider style={{ height: StyleSheet.hairlineWidth }} />
    </Cell>
  )
}
