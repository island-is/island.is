import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { token } from '../../utils'
import { font } from '../../utils/font'

const Host = styled(Animated.View)<{ isAndroid?: boolean }>`
  width: 100%;
  height: ${({ theme }) => theme.spacing[8]}px;
  align-items: center;
  justify-content: center;
  border-bottom-color: ${token((t) => t.border.primary)};
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  background-color: ${token((t) => t.background.invert)};
  ${(props) => props.isAndroid && 'margin-top: -16px;'}
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
  isAndroid?: boolean
  scrollY?: Animated.Value
}

export function SearchHeader({
  count,
  loading,
  loadingText,
  resultText,
  isAndroid,
}: SearchHeaderProps) {
  return (
    <Host isAndroid={isAndroid}>
      <Text>
        {loading ? loadingText : `${count > 0 ? count : ''} ${resultText}`}
      </Text>
    </Host>
  )
}
