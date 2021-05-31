import React from 'react'
import styled from 'styled-components/native'
import { font } from '../../utils/font'

const Host = styled.View`
  width: 100%;
  height: ${({ theme }) => theme.spacing[8]}px;
  align-items: center;
  justify-content: center;
  border-bottom-color: ${({ theme }) =>
    theme.isDark ? theme.shade.shade200 : theme.color.blue200};
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
`

const Text = styled.Text`
  ${font({
    fontWeight: '600',
  })}
`

interface SearchHeaderProps {
  count: number;
  loading: boolean;
  loadingText: string;
  resultText: string;
}

export function SearchHeader({ count, loading, loadingText, resultText }: SearchHeaderProps) {
  return (
    <Host>
      <Text>{loading ? loadingText : `${count > 0 ? count : ''} ${resultText}`}</Text>
    </Host>
  )
}
