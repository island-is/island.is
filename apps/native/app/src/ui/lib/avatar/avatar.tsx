import React from 'react'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View<{ isSmall?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: ${(props) => (props.isSmall ? '48px' : '80px')};
  width: ${(props) => (props.isSmall ? '48px' : '80px')};
  padding-top: ${(props) => (props.isSmall ? '0' : '3px')};
  overflow: hidden;
  border-radius: ${(props) => (props.isSmall ? '48px' : '80px')};
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
`

const Text = styled.Text<{ isSmall?: boolean }>`
  ${font({
    fontSize: (props) => (props.isSmall ? 20 : 32),
    fontWeight: '600',
    lineHeight: (props) => (props.isSmall ? 26 : 38),
    color: ({ theme }) => ({
      light: theme.color.blue400,
      dark: theme.color.roseTinted200,
    }),
  })}
`

interface AvatarProps {
  name: string
  isSmall?: boolean
}

export function Avatar({ name, isSmall }: AvatarProps) {
  function getFirstLetters(str: string) {
    const names = str.split(' ')

    let initials = names[0].substring(0, 1).toUpperCase()

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase()
    }

    return initials
  }

  return (
    <Host isSmall={isSmall}>
      <Text isSmall={isSmall}>{getFirstLetters(name)}</Text>
    </Host>
  )
}
