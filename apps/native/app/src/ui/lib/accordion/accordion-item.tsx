import React, { useRef, useState } from 'react'
import { Animated, Image, LayoutAnimation, Pressable, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import plus from '../../assets/icons/plus.png'
import minus from '../../assets/icons/minus.png'
import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.View<{ isOpen: boolean }>`
  background-color: ${dynamicColor('background')};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
  margin-top: ${({ theme }) => theme.spacing[1]}px;
`
const Header = styled.Pressable`
  padding-vertical: ${({ theme }) => theme.spacing[1]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const Icon = styled(Animated.View)`
  height: 24px;
  width: 24px;
  margin-right: ${({ theme }) => theme.spacing[1]}px;
`

const PlusMinus = styled(Animated.View)`
  height: ${({ theme }) => theme.spacing[3]}px;
  width: ${({ theme }) => theme.spacing[3]}px;
  background-color: ${({ theme }) => theme.color.blue100};
  border-radius: ${({ theme }) => theme.border.radius.full};
  justify-content: center;
  align-items: center;
`

const Content = styled.View``

interface AccordionItemProps {
  children: React.ReactNode
  title: string
  startOpen?: boolean
  icon?: React.ReactNode
}

const toggleAnimation = {
  duration: 300,
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

export function AccordionItem({
  children,
  title,
  icon,
  startOpen = false,
}: AccordionItemProps) {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(startOpen)
  const [shouldStartOpen, setStartOpen] = useState(startOpen)
  const animationController = useRef(new Animated.Value(0)).current

  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: isOpen ? 0 : 1,
      useNativeDriver: true,
    }
    Animated.timing(animationController, config).start()
    LayoutAnimation.configureNext(toggleAnimation)
    if (startOpen && isOpen) {
      setStartOpen(false)
    }
    setIsOpen(!isOpen)
  }

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  })

  return (
    <Host isOpen={isOpen}>
      <Header>
        <Pressable
          onPress={() => toggleListItem()}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 0,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {icon && <Icon>{icon}</Icon>}
            <Typography variant="heading4">{title}</Typography>
          </View>
          <PlusMinus
            style={{
              // If accordion should start open, don't transform the icon since then
              // the minus will be displayed transformed to -90deg
              transform: shouldStartOpen ? [] : [{ rotate: arrowTransform }],
            }}
          >
            <Image
              source={isOpen ? minus : plus}
              style={{ width: theme.spacing[2], height: theme.spacing[2] }}
            />
          </PlusMinus>
        </Pressable>
      </Header>
      {isOpen && <Content>{children}</Content>}
    </Host>
  )
}
