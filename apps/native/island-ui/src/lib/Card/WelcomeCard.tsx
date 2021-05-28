import React from 'react'
import { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View<{ color: any }>`
  padding: 0 0 32px;
  margin-bottom: 30px;
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  width: 283px;
  min-height: 460px;
  background-color: ${dynamicColor((props) => props.color)};
  border-radius: ${({ theme }) => theme.border.radius.large};
`

const Image = styled.Image`
  width: 100%;
  margin-bottom: -35px;
`

const Number = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 20,
  })}
  text-align: center;
`

const TextWrap = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;

  height: ${({ theme }) => theme.spacing[4]}px;
  width: ${({ theme }) => theme.spacing[4]}px;
  margin: 0 auto;
  border: ${({ theme }) => `1px solid ${theme.color.purple300}`};
  border-radius: ${({ theme }) => theme.spacing[4]}px;
`

const Description = styled.Text`
  padding: 16px 27px 0;

  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })}

  text-align: center;
`

interface CardProps {
  number: string
  description?: string
  backgroundColor: { light: string; dark: string }
  imgSrc?: ImageSourcePropType
  style?: any
}

export function WelcomeCard({
  number = '1',
  description,
  imgSrc,
  backgroundColor,
  style,
}: CardProps) {
  const color = backgroundColor
  return (
    <Host color={color} style={style}>
      {imgSrc && <Image source={imgSrc} />}
      <TextWrap>
        <Number>{number}</Number>
      </TextWrap>
      <Description>{description}</Description>
    </Host>
  )
}
