import React from 'react'
import styled from 'styled-components/native'
import { GenericLicenseType } from '../../../graphql/types/schema'
import IconA from '../../assets/licenece-type/icon-a.png'
import IconB from '../../assets/licenece-type/icon-b.png'
import IconBE from '../../assets/licenece-type/icon-be.png'
import IconC from '../../assets/licenece-type/icon-c.png'
import IconCE from '../../assets/licenece-type/icon-ce.png'
import IconD from '../../assets/licenece-type/icon-d.png'
import IconDE from '../../assets/licenece-type/icon-de.png'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

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

const Header = styled.View<{ hideBorder?: boolean }>`
  align-items: center;
  flex-direction: row;
  border-bottom-width: ${({ theme, hideBorder }) =>
    hideBorder ? 0 : theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade500,
      light: theme.color.blue200,
    }),
    true,
  )};
  padding: ${({ theme }) => theme.spacing[2]}px;
`
const HeaderTextBold = styled.Text<{ rightSpacing: boolean }>`
  align-self: flex-start;
  padding-right: ${({ theme, rightSpacing }) =>
    rightSpacing ? theme.spacing[3] : theme.spacing[1]}px;
  ${font({
    fontWeight: '700',
    lineHeight: 24,
  })};
`

const HeaderText = styled.Text`
  flex: 1;
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

const IconImage = styled.Image`
  tint-color: ${dynamicColor('foreground')};
`

interface FieldCardProps {
  code?: string
  title?: string
  children: React.ReactNode
  type?: GenericLicenseType
  hasFields?: boolean
}

export function FieldCard(props: FieldCardProps) {
  let icon = null

  if (props.type === 'DriversLicense') {
    switch (props.code) {
      case 'A':
        icon = (
          <IconImage
            source={IconA}
            resizeMode="contain"
            style={{ width: 24, height: 24 }}
          />
        )
        break
      case 'B':
        icon = (
          <IconImage
            source={IconB}
            resizeMode="contain"
            style={{ width: 24, height: 12 }}
          />
        )
        break
      case 'BE':
        icon = (
          <IconImage
            source={IconBE}
            resizeMode="contain"
            style={{ width: 42, height: 15 }}
          />
        )
        break
      case 'C':
        icon = (
          <IconImage
            source={IconC}
            resizeMode="contain"
            style={{ width: 24, height: 24 }}
          />
        )
        break
      case 'CE':
        icon = (
          <IconImage
            source={IconCE}
            resizeMode="contain"
            style={{ width: 40, height: 24 }}
          />
        )
        break
      case 'DE':
        icon = (
          <IconImage
            source={IconDE}
            resizeMode="contain"
            style={{ width: 58, height: 24 }}
          />
        )
        break
      case 'D':
        icon = (
          <IconImage
            source={IconD}
            resizeMode="contain"
            style={{ width: 24, height: 24 }}
          />
        )
        break
    }
  }

  return (
    <Host>
      {(props.title !== null && (!!props.title || !!props.code)) ||
      (props.title !== undefined && props.code) ? (
        <Header hideBorder={!props.hasFields}>
          <HeaderTextBold rightSpacing={!props.hasFields}>
            {props.code}
          </HeaderTextBold>
          <HeaderText>{props.title}</HeaderText>
          {icon && <IconWrap>{icon}</IconWrap>}
        </Header>
      ) : null}
      {props.hasFields && <ChildrenWrap>{props.children}</ChildrenWrap>}
    </Host>
  )
}
