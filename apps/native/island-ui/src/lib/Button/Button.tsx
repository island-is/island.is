import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { TouchableHighlightProps } from '../../../../../../node_modules/@types/react-native'
import { font } from '../../utils/font'

interface ButtonProps extends TouchableHighlightProps {
  title: string
  isTransparent?: boolean
}

type HostProps = Omit<ButtonProps, 'title'>

const Host = styled.TouchableHighlight<HostProps>`
  padding: ${(props) =>
    `${props.theme.spacing.p3}px ${props.theme.spacing.p4}px`};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.color.dark200
      : props.isTransparent
      ? props.theme.color.transparent
      : props.theme.color.blue400};
  border-radius: ${(props) => props.theme.border.radius.large};
  min-width: 192px;
`

const Text = styled.Text<{ isTransparent?: boolean }>`
  ${font({
    fontWeight: '600',
    color: (props) =>
      props.isTransparent ? props.theme.color.blue400 : props.theme.color.white,
  })}
  text-align: center;
`

export function Button({ title, isTransparent, ...rest }: ButtonProps) {
  const theme = useTheme()
  return (
    <Host
      underlayColor={isTransparent ? theme.shade.shade100 : theme.color.blue600}
      isTransparent={isTransparent}
      {...rest}
    >
      <Text isTransparent={isTransparent}>{title}</Text>
    </Host>
  )
}
