import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'
import chevronForward  from '../../assets/icons/chevron-forward.png'
import { FormattedDate } from 'react-intl'

const Host = styled.View`
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
`

const ImageWrap = styled.View`
  margin-right: ${({ theme }) => theme.spacing[3]}px;
`;

const Content = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;

  ${font({
    fontWeight: '600',
    lineHeight: 24,
    fontSize: 18,
  })}
`

const Text = styled.Text`
  padding-right: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;

  ${font({
    fontWeight: '300',
    lineHeight: 24,
    fontSize: 16,
  })}
`
const LabelWrap = styled.View`
  display: flex;
  flex-flow: row nowrap;
`;

const Label = styled.Text`
  padding: ${({ theme }) => theme.spacing[1]}px;

  width: auto;
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};

  ${font({
    fontWeight: '600',
    lineHeight: 16,
    fontSize: 12,
  })}

  color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue400,
      dark: theme.shades.dark.shade700,
    }),
    true,
  )};
`;

const Icon = styled.View`
  margin-left: auto;
`;

interface VehicleCardProps {
  title: string
  color: string
  number: string
  image: React.ReactNode
  date: Date | null
 }

export function VehicleCard({ title, color, number, image, date }: VehicleCardProps) {
  return (
    <Host>
      <ImageWrap>{image}</ImageWrap>
      <Content>
        <Title>{title}</Title>
        <Text>{color} - {number}</Text>
        <LabelWrap>{date && <Label>Næsta skoðun <FormattedDate value={date} /></Label>}</LabelWrap>
      </Content>
      <Icon><Image source={chevronForward} height={24} width={24} /></Icon>
    </Host>
  )
}
