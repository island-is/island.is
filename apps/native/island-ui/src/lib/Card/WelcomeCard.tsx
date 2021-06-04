import React from 'react'
import { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View<{ color: any }>`
  padding: 0 0 24px;
  margin-bottom: 30px;
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  width: 283px;
  min-height: 406px;
  background-color: ${dynamicColor((props) => props.color)};
  border-radius: ${({ theme }) => theme.border.radius.large};
`

const Image = styled.Image`
  width: 100%;
  height: 262px;
`

const Description = styled.Text`
  padding: 0 24px 0;

  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })}
`

interface CardProps {
  description?: string
  backgroundColor: { light: string; dark: string }
  imgSrc?: ImageSourcePropType
  style?: any
}

export function WelcomeCard({
  description,
  imgSrc,
  backgroundColor,
  style,
}: CardProps) {
  const color = backgroundColor
  return (
    <Host color={color} style={style}>
      {imgSrc && <Image source={imgSrc} resizeMode="cover" />}
      <Description>{description}</Description>
    </Host>
  )
}
