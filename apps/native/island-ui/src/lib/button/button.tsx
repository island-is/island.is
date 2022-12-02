import React from 'react'
import { TouchableHighlightProps } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

interface ButtonProps extends TouchableHighlightProps {
  title: string
  icon?: React.ReactNode;
  isTransparent?: boolean
  isOutlined?: boolean
}

type HostProps = Omit<ButtonProps, 'title'>

const Host = styled.TouchableHighlight<HostProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${(props) =>
    `${props.theme.spacing.p3}px ${props.theme.spacing.p4}px`};
  background-color: ${dynamicColor<HostProps>(
    ({ theme, disabled, isTransparent, isOutlined }) =>
      isTransparent || isOutlined
        ? 'transparent'
        : {
            dark: disabled ? theme.shades.dark.shade200 : theme.color.blue400,
            light: disabled ? theme.color.dark200 : theme.color.blue400,
          },
  )};

  border-color: ${dynamicColor<HostProps>(
    ({ theme, disabled, isOutlined }) =>
      !isOutlined
        ? 'transparent'
        : {
          dark: disabled ? theme.shades.dark.shade200 : theme.color.blue400,
          light: disabled ? theme.color.dark200 : theme.color.blue400,
        },
  )};

  border-radius: ${(props) => props.theme.border.radius.large};
  min-width: 192px;
  ${(props) => props.isOutlined && `
    border-width: 1px;
    border-style: solid;

  `}
`

const Text = styled.Text<{ isTransparent?: boolean, isOutlined?: boolean }>`
  ${font({
    fontWeight: '600',
    color: (props) =>
      props.isTransparent || props.isOutlined ? props.theme.color.blue400 : props.theme.color.white,
  })}
  text-align: center;
`

const Icon = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 10px;
`;

export function Button({ title, isTransparent, isOutlined, icon, ...rest }: ButtonProps) {
  const theme = useTheme()
  return (
    <Host
      underlayColor={isTransparent || isOutlined ? theme.shade.shade100 : theme.color.blue600}
      isTransparent={isTransparent}
      isOutlined={isOutlined}
      {...rest}
    >
      <>
        <Text isTransparent={isTransparent} isOutlined={isOutlined}>{title}</Text>
        {icon && <Icon source={icon as any} resizeMode="center" />}
      </>
    </Host>
  )
}
