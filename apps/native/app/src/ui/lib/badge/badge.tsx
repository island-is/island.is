import React from 'react'
import styled from 'styled-components/native'
import { Typography } from '../typography/typography'
import { ColorValue } from 'react-native'

const Host = styled.View<{ type: string }>`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.border.radius.standard};
  background-color: ${(props) =>
    props.type === 'green'
      ? props.theme.color.mint200
      : props.type === 'blue'
      ? props.theme.color.blue100
      : props.theme.color.blueberry100};
  padding: ${({ theme }) => theme.spacing[1]}px;
`

interface BadgeProps {
  title: string
  type: 'green' | 'blue' | 'purple'
  titleColor: ColorValue
}

export function Badge({ title, type, titleColor }: BadgeProps) {
  return (
    <Host type={type}>
      <Typography variant="eyebrow" color={titleColor}>
        {title}
      </Typography>
    </Host>
  )
}
