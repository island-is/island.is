import React from 'react'
import styled from 'styled-components/native'
import timeOutlineIcon from '../../assets/card/time-outline.png'
import { dynamicColor } from '../../utils/dynamic-color'

const Host = styled.View`
  width: 100%;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade300,
      light: theme.color.blue200,
    }),
    true,
  )};
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
  tint-color: ${dynamicColor(({ theme }) => ({
    dark: 'shade600',
    light: theme.color.blue200,
  }))};
`

const TimeSkeleton = styled.View`
  height: 12px;
  width: 110px;
  background-color: ${dynamicColor(({ theme }) => ({
    dark: 'shade200',
    light: theme.color.blue100,
  }))};
  border-radius: 4px;
`

const Bar = styled.View`
  height: 12px;
  padding: 2px;
  overflow: hidden;
  background-color: ${dynamicColor(({ theme }) => ({
    dark: 'shade200',
    light: theme.color.blue100,
  }))};
  border-radius: 6px;

  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const Progress = styled.View<{ width?: number }>`
  flex: 1;
  width: ${(props) => props.width ?? 0}%;
  border-radius: 6px;
  width: 30%;
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: 'shade300',
  }))};
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
  background-color: ${dynamicColor(({ theme }) => ({
    dark: 'shade200',
    light: theme.color.blue100,
  }))};
`

const TitleSkeleton = styled.View`
  height: 16px;
  width: 60%;
  background-color: ${dynamicColor(({ theme }) => ({
    dark: 'shade200',
    light: theme.color.blue100,
  }))};
  border-radius: 4px;
`

const BadgeSkeleton = styled.View`
  width: 49px;
  height: 32px;
  border-radius: 8px;
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue100,
    dark: 'shade200',
  }))};
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
