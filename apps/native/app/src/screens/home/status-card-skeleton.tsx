import React from 'react'
import { dynamicColor } from '@island.is/island-ui-native'
import styled from 'styled-components/native'
import timeOutlineIcon from '../../assets/card/time-outline.png'

const Host = styled.View`
  width: 100%;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade300,
    light: theme.color.blue200,
  }))};
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  padding: ${({ theme }) => theme.spacing[2]}px;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const TimeIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 4px;
`

export function StatusCardSkeleton() {
  return (
    <Host>
      <Date>
        <TimeIcon source={timeOutlineIcon} />
      </Date>
    </Host>
  )
}
