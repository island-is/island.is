import React from 'react'
import styled from 'styled-components/native'
import { token } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  width: 100%;
  padding: 18px 16px;
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
  background-color: ${token((t) => t.background.brandMinimal)};
  border-radius: ${(props) => props.theme.border.radius.large};
`

const Text = styled.Text`
  ${font({
    fontWeight: '600',
    lineHeight: 20,
    fontSize: 16,
  })}
  color: ${token((t) => t.interactive.foreground.primary)};
`

interface LinkCardProps {
  children: React.ReactNode
}

export function LinkCard({ children }: LinkCardProps) {
  return (
    <Host>
      <Text>{children}</Text>
    </Host>
  )
}
