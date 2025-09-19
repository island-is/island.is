import React, { useRef } from 'react'
import {
  Animated,
  Image,
  ImageSourcePropType,
  LayoutAnimation,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { dynamicColor } from '../../utils/dynamic-color'
import { Typography } from '../typography/typography'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
`

const Card = styled.TouchableHighlight<{ open?: boolean }>`
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-bottom-left-radius: ${({ theme, open }) =>
    open ? 0 : theme.border.radius.large};
  border-bottom-right-radius: ${({ theme, open }) =>
    open ? 0 : theme.border.radius.large};
  background-color: ${dynamicColor((props) => ({
    dark: 'shade100',
    light: props.theme.color.blue100,
  }))};
`

const Container = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
`

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing[1]}px;
`

const TitleText = styled(Typography)`
  flex: 1;
`

const IconWrapper = styled.View`
  width: 24px;
  height: 24px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.border.radius.full};
  margin-right: ${({ theme }) => theme.spacing[1]}px;
`

const IconMessage = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  flex: 1;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Message = styled(Typography)`
  flex: 1;
  flex-shrink: 1;
  margin-right: ${({ theme }) => theme.spacing[1]}px;
`

const Expanded = styled.View`
  background-color: ${dynamicColor('background')};
  border-bottom-left-radius: ${({ theme }) => theme.border.radius.large};
  border-bottom-right-radius: ${({ theme }) => theme.border.radius.large};
`

interface CardProps {
  titleIcon?: ImageSourcePropType
  title: React.ReactNode
  titleColor?: string
  message: React.ReactNode
  icon?: ImageSourcePropType
  value?: React.ReactNode
  topRightValue?: React.ReactNode
  children?: React.ReactNode
  open?: boolean
  onPress?: () => void
}

const toggleAnimation = {
  duration: 300,
  create: {
    duration: 300,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  update: {
    duration: 300,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    duration: 200,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
}

export const ExpandableCard = ({
  icon,
  title,
  titleIcon,
  titleColor,
  topRightValue,
  message,
  value,
  children,
  open,
  onPress,
}: CardProps) => {
  const theme = useTheme()
  const animationController = useRef(new Animated.Value(0)).current

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  })

  return (
    <Host
      style={{
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: open ? 0.08 : 0,
        shadowRadius: 16,
        elevation: 1,
        shadowColor: 'rgb(0, 32, 128)',
        backgroundColor: theme.color.white,
      }}
    >
      <Card
        onPress={() => {
          const config = {
            duration: 300,
            toValue: open ? 0 : 1,
            useNativeDriver: true,
          }
          Animated.timing(animationController, config).start()
          LayoutAnimation.configureNext(toggleAnimation)
          onPress?.()
        }}
        underlayColor={theme.isDark ? theme.shade.shade200 : '#EBEBFA'}
        open={open}
      >
        <Container>
          {title && (
            <Row style={{ marginBottom: theme.spacing[1] }}>
              <Title>
                {titleIcon && (
                  <Image
                    source={titleIcon}
                    style={{
                      width: 16,
                      height: 16,
                      tintColor: titleColor ?? theme.color.primary,
                      marginRight: theme.spacing.smallGutter,
                    }}
                  />
                )}
                <TitleText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  variant="body3"
                  color={titleColor}
                >
                  {title}
                </TitleText>
              </Title>
              {topRightValue && (
                <Typography variant="body3">{topRightValue}</Typography>
              )}
            </Row>
          )}
          <Row>
            <IconMessage>
              {icon && (
                <IconWrapper>
                  <Animated.Image
                    source={icon}
                    style={{
                      width: 16,
                      height: 16,
                      transform: [{ rotate: arrowTransform }],
                    }}
                  />
                </IconWrapper>
              )}
              <Message variant="heading5">{message}</Message>
            </IconMessage>
            <Typography variant="heading5">{value}</Typography>
          </Row>
        </Container>
      </Card>
      {open && <Expanded>{children}</Expanded>}
    </Host>
  )
}
