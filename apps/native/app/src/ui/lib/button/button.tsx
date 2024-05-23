import React from 'react'
import {
  ImageStyle,
  TextProps,
  TextStyle,
  TouchableHighlightProps,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

interface ButtonProps extends TouchableHighlightProps {
  title: string
  icon?: React.ReactNode
  isTransparent?: boolean
  isOutlined?: boolean
  isUtilityButton?: boolean
  textStyle?: TextStyle
  textProps?: TextProps
  iconStyle?: ImageStyle
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
    ({ theme, disabled, isTransparent, isOutlined, isUtilityButton }) =>
      isTransparent || isOutlined || isUtilityButton
        ? 'transparent'
        : {
            dark: disabled ? theme.shades.dark.shade200 : theme.color.blue400,
            light: disabled ? theme.color.dark200 : theme.color.blue400,
          },
  )};

  border-color: ${dynamicColor<HostProps>(
    ({ theme, disabled, isOutlined, isUtilityButton }) =>
      !isOutlined
        ? 'transparent'
        : isUtilityButton
        ? {
            dark: '#CCDFFF55',
            light: theme.color.blue200,
          }
        : {
            dark: disabled ? theme.shades.dark.shade200 : theme.color.blue400,
            light: disabled ? theme.color.dark200 : theme.color.blue400,
          },
  )};

  border-radius: ${(props) => props.theme.border.radius.large};
  min-width: ${(props) => (props.isUtilityButton ? 0 : '192px')};
  ${(props) =>
    props.isOutlined &&
    `
    border-width: 1px;
    border-style: solid;

  `}
`

const Text = styled.Text<{
  isTransparent?: boolean
  isOutlined?: boolean
  isUtilityButton?: boolean
  disabled?: boolean
}>`
  ${font({
    fontWeight: '600',
    color: (props) =>
      props.isTransparent && props.disabled
        ? props.theme.color.dark200
        : props.isUtilityButton
        ? {
            light: props.theme.color.dark400,
            dark: props.theme.color.white,
          }
        : props.isTransparent || props.isOutlined
        ? props.theme.color.blue400
        : props.theme.color.white,
  })}
  font-size: ${(props) => props.isUtilityButton && '12px'};
  text-align: ${(props) => (props.isUtilityButton ? 'left' : 'center')};
`

const Icon = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 10px;
`

export function Button({
  title,
  isTransparent,
  isOutlined,
  isUtilityButton,
  icon,
  textStyle,
  textProps,
  iconStyle,
  ...rest
}: ButtonProps) {
  const theme = useTheme()
  return (
    <Host
      underlayColor={
        isTransparent || isOutlined || isUtilityButton
          ? theme.shade.shade100
          : theme.color.blue600
      }
      isTransparent={isTransparent}
      isOutlined={isOutlined}
      isUtilityButton={isUtilityButton}
      {...rest}
    >
      <>
        <Text
          {...textProps}
          isTransparent={isTransparent}
          isOutlined={isOutlined}
          isUtilityButton={isUtilityButton}
          disabled={rest.disabled}
          style={textStyle}
        >
          {title}
        </Text>
        {icon && (
          <Icon source={icon as any} resizeMode="center" {...iconStyle} />
        )}
      </>
    </Host>
  )
}
