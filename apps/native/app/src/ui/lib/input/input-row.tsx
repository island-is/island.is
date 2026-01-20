import React from 'react'
import styled from 'styled-components/native'

const Host = styled.View<{ background: boolean }>`
  flex-direction: row;
  background-color: ${({ theme, background }) =>
    background ? theme.color.blueberry100 : 'transparent'};
  border-radius: ${({ theme }) => theme.border.radius.standard};
`

interface InputRowProps {
  background?: boolean
  children: React.ReactNode
  testID?: string | undefined
}

export function InputRow({
  children,
  testID,
  background = false,
}: InputRowProps) {
  return (
    <Host background={background} testID={testID}>
      {children}
    </Host>
  )
}
