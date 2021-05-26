import React from 'react'
import styled from 'styled-components/native'
import { font } from '../../utils/font'

const Host = styled.View`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.border.radius.standard};
  background-color: ${({ theme }) => theme.color.roseTinted100};
  padding: 5px 7px;
`

const Text = styled.Text`
  ${font({
    fontSize: 13,
    fontWeight: '600',
    color: ({ theme }) => theme.color.roseTinted400,
  })}
`

interface BadgeProps {
  title: string
}

export function Badge({ title }: BadgeProps) {
  return (
    <Host>
      <Text>{title}</Text>
    </Host>
  )
}
