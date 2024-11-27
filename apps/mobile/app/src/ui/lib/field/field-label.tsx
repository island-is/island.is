import React from 'react'
import styled from 'styled-components/native'
import { font } from '../../utils/font'

const Host = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;

  ${font({
    fontSize: 13,
    lineHeight: 17,
  })}
`

interface FieldLabelProps {
  children: React.ReactNode
}

export function FieldLabel({ children }: FieldLabelProps) {
  return <Host>{children}</Host>
}
