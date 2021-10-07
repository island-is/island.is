import React from 'react'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  margin-left: -${({ theme }) => theme.spacing[2]}px;;
  margin-right: -${({ theme }) => theme.spacing[2]}px;;
  height: ${({ theme }) => theme.spacing[8]}px;
  align-items: center;
  justify-content: center;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade200,
    light: theme.color.blue200
  }))};
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  background-color: ${dynamicColor('background')};
`

const Text = styled.Text`
  ${font({
    fontWeight: '600',
  })}
`

interface SearchHeaderProps {
  count: number
  loading: boolean
  loadingText: string
  resultText: string
}

export function SearchHeader({
  count,
  loading,
  loadingText,
  resultText,
}: SearchHeaderProps) {
  return (
    <Host>
      <Text>
        {loading ? loadingText : `${count > 0 ? count : ''} ${resultText}`}
      </Text>
    </Host>
  )
}
