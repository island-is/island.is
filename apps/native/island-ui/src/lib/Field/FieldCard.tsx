import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

const Host = styled.View`
  border-width: 1px;
  border-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade500
      : props.theme.color.blue200};
  border-radius: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
`

const Header = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade500
      : props.theme.color.blue200};
  padding: 16px;
`

const HeaderText = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.shade.foreground};
  padding-right: 4px;
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
        <HeaderText style={{ fontFamily: 'IBMPlexSans-Bold' }}>
          {props.code}
        </HeaderText>
        <HeaderText>{props.title}</HeaderText>
      </Header>
      <View style={{ padding: 16, paddingBottom: 0 }}>{props.children}</View>
    </Host>
  )
}
