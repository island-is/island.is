import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import chevronForward from '../../assets/icons/chevron-forward.png'
import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.View<{ minHeight?: number }>`
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.spacing[3]}px;
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
  align-items: center;
  justify-content: space-between;
  min-height: ${({ minHeight }) => (minHeight ? minHeight + 'px' : 'auto')};
`

const Content = styled.View`
  flex: 1;
  align-items: flex-start;
`

const Title = styled(Typography)`
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Text = styled(Typography)`
  padding-right: ${({ theme }) => theme.spacing[2]}px;
`

const Icon = styled.View`
  margin-left: auto;
`

const Label = styled.View`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

interface VehicleCardProps {
  title?: string | null
  color?: string | null
  number?: string | null
  minHeight?: number
  label?: React.ReactNode
}

export function VehicleCard({
  title,
  color,
  number,
  label,
  minHeight,
}: VehicleCardProps) {
  return (
    <Host minHeight={minHeight}>
      <Content>
        <Title
          variant="heading4"
          numberOfLines={minHeight ? 1 : undefined}
          ellipsizeMode="tail"
        >
          {title}
        </Title>
        <Text>
          {color} - {number}
        </Text>
        {label && <Label>{label}</Label>}
      </Content>
      <Icon>
        <Image source={chevronForward} style={{ width: 24, height: 24 }} />
      </Icon>
    </Host>
  )
}
