import React from 'react'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 32px;
  padding-right: 32px;
  border-radius: 32px;
  background-color: ${dynamicColor('background')};
`

const Text = styled.Text`
  ${font()}
`
interface BubbleProps {
  children: React.ReactNode
}

export function Bubble({ children }: BubbleProps) {
  return (
    <Host>
      <Text>{children}</Text>
    </Host>
  )
}
