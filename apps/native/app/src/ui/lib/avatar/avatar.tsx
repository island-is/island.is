import React from 'react'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View<{ size?: 'small' | 'medium' | 'large' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: ${(props) =>
    props.size === 'small'
      ? '32px'
      : props.size === 'medium'
      ? '48px'
      : '80px'};
  width: ${(props) =>
    props.size === 'small'
      ? '32px'
      : props.size === 'medium'
      ? '48px'
      : '80px'};
  padding-top: ${(props) => (props.size === 'small' ? '0' : '3px')};
  overflow: hidden;
  border-radius: ${(props) =>
    props.size === 'small'
      ? '32px'
      : props.size === 'medium'
      ? '48px'
      : '80px'};
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
`

const Text = styled.Text<{ size?: 'small' | 'medium' | 'large' }>`
  ${font({
    fontSize: (props) =>
      props.size === 'small' ? 14 : props.size === 'medium' ? 20 : 32,
    fontWeight: '600',
    lineHeight: (props) =>
      props.size === 'small' ? 15 : props.size === 'medium' ? 26 : 38,
    color: ({ theme }) => ({
      light: theme.color.blue400,
      dark: theme.color.roseTinted200,
    }),
  })}
`

interface AvatarProps {
  name: string
  size?: 'small' | 'medium' | 'large'
}

export function Avatar({ name, size = 'medium' }: AvatarProps) {
  function getFirstLetters(str: string) {
    const names = str.split(' ')

    let initials = names[0].substring(0, 1).toUpperCase()

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase()
    }

    return initials
  }

  return (
    <Host size={size}>
      <Text size={size}>{getFirstLetters(name)}</Text>
    </Host>
  )
}
