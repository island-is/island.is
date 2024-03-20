import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { font } from '../../utils/font'
import { dynamicColor } from '@ui/utils'

const Host = styled.View`
  display: flex;
  flex: 1;

  justify-content: center;
  align-items: center;
  padding: 0 53px;
`

const HostWithBorder = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-vertical: ${({ theme }) => theme.spacing[4]}px;

  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
`

const ImageWrap = styled.View`
  margin-bottom: 50px;
`

const Title = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;

  ${font({
    fontWeight: '600',
  })}

  text-align: center;
`

const Description = styled.Text`
  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })}
  text-align: center;
`

interface HeadingProps {
  title: React.ReactNode
  description: React.ReactNode
  image: React.ReactNode
}

export function EmptyList({ title, description, image }: HeadingProps) {
  return (
    <Host>
      <ImageWrap>{image}</ImageWrap>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Host>
  )
}

export function EmptyListSmall({ title, description, image }: HeadingProps) {
  return (
    <HostWithBorder>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <View>{image}</View>
    </HostWithBorder>
  )
}
