import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'
import IconA from '../../assets/licenece-type/icon-a.png'
import IconB from '../../assets/licenece-type/icon-b.png'
import IconBE from '../../assets/licenece-type/icon-be.png'
import IconC from '../../assets/licenece-type/icon-c.png'
import IconCE from '../../assets/licenece-type/icon-ce.png'
import IconD from '../../assets/licenece-type/icon-d.png'
import IconDE from '../../assets/licenece-type/icon-de.png'

const Host = styled.View`
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade500,
      light: theme.color.blue200,
    }),
    true,
  )};
  border-radius: ${({ theme }) => theme.spacing[2]}px;
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Header = styled.View`
  align-items: center;
  flex-direction: row;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade500,
      light: theme.color.blue200,
    }),
    true,
  )};
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
`

interface FieldCardProps {
  code?: string
  title: string
  children: React.ReactNode
}

export function FieldCard(props: FieldCardProps) {
  let icon = null

  switch (props.code) {
    case 'A':
      icon = (
        <Image source={IconA} resizeMode="contain" height={24} width={24} />
      )
      break
    case 'B':
      icon = (
        <Image source={IconB} resizeMode="contain" height={12} width={24} />
      )
      break
    case 'BE':
      icon = (
        <Image source={IconBE} resizeMode="contain" height={15} width={42} />
      )
      break
    case 'C':
      icon = (
        <Image source={IconC} resizeMode="contain" height={24} width={24} />
      )
      break
    case 'CE':
      icon = (
        <Image source={IconCE} resizeMode="contain" height={15} width={40} />
      )
      break
    case 'DE':
      icon = (
        <Image source={IconDE} resizeMode="contain" height={15} width={58} />
      )
      break
    case 'D':
      icon = (
        <Image source={IconD} resizeMode="contain" height={24} width={24} />
      )
      break
  }
  return (
    <Host>
      <Header>
        <HeaderTextBold>{props.code}</HeaderTextBold>
        <HeaderText>{props.title}</HeaderText>
        {icon && <IconWrap>{icon}</IconWrap>}
      </Header>
      <ChildrenWrap>{props.children}</ChildrenWrap>
    </Host>
  )
}
