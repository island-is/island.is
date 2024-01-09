import React from 'react'
import styled from 'styled-components/native'

const Host = styled.View`
  flex-direction: row;
`

interface InputRowProps {
  children: React.ReactNode
}

export function InputRow({ children }: InputRowProps) {
  return <Host>{children}</Host>
}
