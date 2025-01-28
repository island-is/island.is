import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.View`
  display: flex;
  flex: 1;

  justify-content: center;
  align-items: center;
  padding: 0 53px;
  margin-top: ${({ theme }) => theme.spacing[3]}px;
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

const Title = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
  text-align: center;
`

const Description = styled(Typography)`
  text-align: center;
`

interface HeadingProps {
  title: React.ReactNode
  description: React.ReactNode
  image: React.ReactNode
  small?: boolean
}

export function EmptyList({ title, description, image, small }: HeadingProps) {
  if (small) {
    return (
      <HostWithBorder>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <View>{image}</View>
      </HostWithBorder>
    )
  }
  return (
    <Host>
      <ImageWrap>{image}</ImageWrap>
      <Title variant={'heading3'}>{title}</Title>
      <Description>{description}</Description>
    </Host>
  )
}
