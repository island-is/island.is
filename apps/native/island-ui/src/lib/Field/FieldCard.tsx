import React from 'react'
import styled from 'styled-components/native'
import { font } from '../../utils/font'

const Host = styled.View`
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${({ theme }) =>
    theme.isDark ? theme.shade.shade500 : theme.color.blue200};
  border-radius: ${({ theme }) => theme.spacing[2]}px;
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Header = styled.View`
  flex-direction: row;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${({ theme }) =>
    theme.isDark ? theme.shade.shade500 : theme.color.blue200};
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

interface FieldCardProps {
  code?: string
  title: string
  children: React.ReactNode
}

export function FieldCard(props: FieldCardProps) {
  return (
    <Host>
      <Header>
        <HeaderTextBold>{props.code}</HeaderTextBold>
        <HeaderText>{props.title}</HeaderText>
      </Header>
      <ChildrenWrap>{props.children}</ChildrenWrap>
    </Host>
  )
}
