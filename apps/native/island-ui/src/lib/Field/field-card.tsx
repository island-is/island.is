import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'
import IconB from '../../assets/icons/icon-b.png';
import IconBE from '../../assets/icons/icon-be.png';

const Host = styled.View`
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade500,
    light: theme.color.blue200,
  }))};
  border-radius: ${({ theme }) => theme.spacing[2]}px;
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Header = styled.View`
  align-items: center;
  flex-direction: row;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade500,
    light: theme.color.blue200,
  }))};
  padding: ${({ theme }) => theme.spacing[2]}px;
`
const HeaderTextBold = styled.Text`
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  ${font({
    fontWeight: '700',
    lineHeight: 24,
  })};
`

const HeaderText = styled.Text`
  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })};
`

const ChildrenWrap = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: 0;
`

const IconWrap = styled.View`
  margin-left: auto;
`;

interface FieldCardProps {
  code?: string
  title: string
  children: React.ReactNode
}

export function FieldCard(props: FieldCardProps) {
  let icon = null;

  switch (props.code) {
    case 'B':
      icon = <Image source={IconB} height={12} width={24}  />
      break;
    case 'BE':
      icon = <Image source={IconBE} height={15} width={42}  />
      break;
  }
  return (
    <Host>
      <Header>
        <HeaderTextBold>{props.code}</HeaderTextBold>
        <HeaderText>{props.title}</HeaderText>
        <IconWrap>{icon}</IconWrap>
      </Header>
      <ChildrenWrap>{props.children}</ChildrenWrap>
    </Host>
  )
}
