import React from 'react'
import styled from 'styled-components/native'
import timeOutlineIcon from '../../assets/card/time-outline.png'
import { token } from '../../utils/dynamic-color'

const Host = styled.View`
  width: 100%;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${token((t) => t.border.primary)};
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  padding: ${({ theme }) => theme.spacing[2]}px;
  min-height: 180px;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const TimeIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  tint-color: ${token((t) => t.background.brandLighter)};
`

const TimeSkeleton = styled.View`
  height: 12px;
  width: 110px;
  background-color: ${token((t) => t.background.brandMinimal)};
  border-radius: 4px;
`

const Bar = styled.View`
  height: 12px;
  padding: 2px;
  overflow: hidden;
  background-color: ${token((t) => t.background.brandMinimal)};
  border-radius: 6px;

  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const Progress = styled.View<{ width?: number }>`
  flex: 1;
  width: ${(props) => props.width ?? 0}%;
  border-radius: 6px;
  width: 30%;
  background-color: ${token((t) => t.background.brandLighter)};
`

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const IconSkeleton = styled.View`
  width: 24px;
  height: 24px;
  margin-right: ${({ theme }) => theme.spacing[1]}px;
  border-radius: 4px;
  background-color: ${token((t) => t.background.brandMinimal)};
`

const TitleSkeleton = styled.View`
  height: 16px;
  width: 60%;
  background-color: ${token((t) => t.background.brandMinimal)};
  border-radius: 4px;
`

const BadgeSkeleton = styled.View`
  width: 49px;
  height: 32px;
  border-radius: 8px;
  background-color: ${token((t) => t.background.brandMinimal)};
`

const Flex = styled.View`
  flex: 1;
`

export function StatusCardSkeleton() {
  return (
    <Host>
      <Date>
        <TimeIcon source={timeOutlineIcon} />
        <TimeSkeleton />
        <Flex />
        <BadgeSkeleton />
      </Date>
      <Title>
        <IconSkeleton />
        <TitleSkeleton />
      </Title>
      <Bar>
        <Progress />
      </Bar>
    </Host>
  )
}
