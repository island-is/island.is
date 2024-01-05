import React, { useRef, useState } from 'react'
import { Animated, Image, LayoutAnimation, Pressable, View } from 'react-native'
import styled from 'styled-components/native'
import chevron from '../../assets/icons/chevron-down.png'
import { dynamicColor, font } from '../../utils'

const Host = styled.View<{ isOpen: boolean }>`
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme, isOpen }) =>
    isOpen ? theme.border.width.xl : theme.border.width.standard}px;
  border-color: ${dynamicColor(({ theme, isOpen }) => ({
    light: isOpen ? theme.color.mint400 : theme.color.blue200,
    dark: isOpen ? theme.color.mint400 : theme.color.blue200,
  }))};
  background-color: ${dynamicColor('background')};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`
const Header = styled.Pressable`
  padding: 10px 16px;
`

const Title = styled.Text`
  ${font({
    fontSize: 16,
    fontWeight: '600',
  })}
`

const Icon = styled(Animated.View)`
  height: 24px;
  width: 24px;
  margin-right: ${({ theme }) => theme.spacing[1]}px;
`

const Chevron = styled(Animated.View)`
  height: 25px;
  width: 25px;
`

const Content = styled.View`
  border-top-width: ${({ theme }) => theme.border.width.standard}px;
  border-top-color: ${({ theme }) => theme.color.blue200};
`

interface AccordionItemProps {
  children: React.ReactNode
  title: string
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

export function AccordionItem({ children, title, icon }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const animationController = useRef(new Animated.Value(0)).current

  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: isOpen ? 0 : 1,
      useNativeDriver: true,
    }
    Animated.timing(animationController, config).start()
    LayoutAnimation.configureNext(toggleAnimation)
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
            margin: isOpen ? -2 : 0,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {icon && <Icon>{icon}</Icon>}
            <Title>{title}</Title>
          </View>
          <Chevron style={{ transform: [{ rotate: arrowTransform }] }}>
            <Image source={chevron} style={{ width: 24, height: 24 }} />
          </Chevron>
        </Pressable>
      </Header>
      {isOpen && <Content>{children}</Content>}
    </Host>
  )
}
