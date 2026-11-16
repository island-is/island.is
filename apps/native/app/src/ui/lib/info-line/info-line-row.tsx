import React from 'react'
import styled from 'styled-components/native'

const Host = styled.View<{ background: boolean }>`
  flex-direction: row;
  background-color: ${({ theme, background }) =>
    background
      ? theme.tokens.feedback.tags.blueberry.background
      : 'transparent'};
  border-radius: ${({ theme }) => theme.border.radius.standard};
`

interface InfoLineRowProps {
  background?: boolean
  children: React.ReactNode
  testID?: string | undefined
}

export function InfoLineRow({
  children,
  testID,
  background = false,
}: InfoLineRowProps) {
  return (
    <Host background={background} testID={testID}>
      {children}
    </Host>
  )
}

/** @deprecated Use `InfoLineRow`. */
export const InputRow = InfoLineRow
