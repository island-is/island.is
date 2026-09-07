import React from 'react'
import styled from 'styled-components/native'
import { getInitials } from '../../../utils/get-initials'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View<{ isSmall?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: ${(props) => (props.isSmall ? '40px' : '48px')};
  width: ${(props) => (props.isSmall ? '40px' : '48px')};
  overflow: hidden;
  border-radius: ${(props) => (props.isSmall ? '40px' : '48px')};
  background-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
`

const Text = styled.Text<{ isSmall?: boolean }>`
  ${font({
    fontSize: (props) => (props.isSmall ? 16 : 20),
    fontWeight: '600',
    lineHeight: (props) => (props.isSmall ? 20 : 26),
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
  return (
    <Host isSmall={isSmall}>
      <Text isSmall={isSmall}>{getInitials(name)}</Text>
    </Host>
  )
}
