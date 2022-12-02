import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 80px;
  width: 80px;
  padding-top: 3px;
  overflow: hidden;
  border-radius: 80px;
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
`

const Text = styled.Text`
  ${font({
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 38,
    color: ({ theme }) => ({
      light: theme.color.blue400,
      dark: theme.color.roseTinted200,
    }),
  })}
`

interface AvatarProps {
  name: string
}

export function Avatar({ name }: AvatarProps) {
  const letters = name.match(/\b(\w)/g)?.join('').slice(0,2) || [];
  return (
    <Host>
      <Text>{letters}</Text>
    </Host>
  )
}
