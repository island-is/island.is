import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.View`
  display: flex;
  flex-direction: row;
  padding-horizontal: ${({ theme }) => theme.spacing[3]}px;
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  min-height: 130px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: 1px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
  column-gap: ${({ theme }) => theme.spacing[4]}px;
  align-items: center;
`

const TextWrapper = styled.View`
  flex: 1;
`

interface EmptyCardProps {
  text: string
  image: React.ReactNode
  link: React.ReactNode
}

export function EmptyCard({ text, image, link }: EmptyCardProps) {
  return (
    <Host>
      <TextWrapper>
        <Typography variant="body3">{text}</Typography>
        {link && <View style={{ flexWrap: 'wrap' }}>{link}</View>}
      </TextWrapper>
      <View>{image}</View>
    </Host>
  )
}
