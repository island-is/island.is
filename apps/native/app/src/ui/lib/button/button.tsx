import React from 'react'
import {
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { TokenSelector, useTokenColor } from '../../utils'
import { fontByWeight } from '../../utils/font'

interface ButtonBaseProps extends Omit<PressableProps, 'style'> {
  isTransparent?: boolean
  isOutlined?: boolean
  isUtilityButton?: boolean
  /** Utility button variant with filled blue background and white text */
  isFilledUtilityButton?: boolean
  /** Height of primary and outlined buttons: default 48, small 40 */
  size?: 'default' | 'small'
  style?: StyleProp<ViewStyle>
  textStyle?: TextStyle
  textProps?: TextProps
  iconStyle?: ImageStyle
  ellipsis?: boolean
  iconPosition?: 'start' | 'end'
  loading?: boolean
}

interface IconButtonProps extends ButtonBaseProps {
  title?: never
  icon: ImageSourcePropType
}

interface TextButtonProps extends ButtonBaseProps {
  title: string
  icon?: ImageSourcePropType
}

export type ButtonProps = IconButtonProps | TextButtonProps

type Variant =
  | 'primary'
  | 'outlined'
  | 'transparent'
  | 'utility'
  | 'utilityFilled'
type State = 'default' | 'pressed' | 'disabled'

type VariantColours = {
  background?: TokenSelector
  border?: TokenSelector
  text: TokenSelector
}

// Colours per variant and state, from the Figma Button component. Loading
// uses the disabled colours.
const colours: Record<Variant, Record<State, VariantColours>> = {
  primary: {
    default: {
      background: (t) => t.interactive.background.primary,
      text: (t) => t.interactive.foreground.invert,
    },
    pressed: {
      background: (t) => t.interactive.background.primaryActive,
      text: (t) => t.interactive.foreground.invert,
    },
    disabled: {
      background: (t) => t.interactive.background.primaryDisabled,
      text: (t) => t.interactive.foreground.invert,
    },
  },
  outlined: {
    default: {
      border: (t) => t.interactive.border.borderPrimary,
      text: (t) => t.interactive.foreground.primary,
    },
    pressed: {
      border: (t) => t.interactive.border.borderActive,
      text: (t) => t.interactive.foreground.primaryActive,
    },
    disabled: {
      border: (t) => t.interactive.border.borderDisabled,
      text: (t) => t.interactive.foreground.primaryDisabled,
    },
  },
  transparent: {
    default: { text: (t) => t.interactive.foreground.primary },
    pressed: { text: (t) => t.interactive.foreground.primaryActive },
    disabled: { text: (t) => t.interactive.foreground.primaryDisabled },
  },
  utility: {
    default: {
      border: (t) => t.interactive.border.borderPrimaryMinimal,
      text: (t) => t.interactive.foreground.default,
    },
    pressed: {
      background: (t) => t.interactive.background.primaryMinimalActive,
      border: (t) => t.interactive.border.borderPrimaryMinimal,
      text: (t) => t.interactive.foreground.default,
    },
    disabled: {
      border: (t) => t.interactive.border.borderPrimaryMinimal,
      text: (t) => t.interactive.foreground.disabled,
    },
  },
  utilityFilled: {
    default: {
      background: (t) => t.interactive.background.primary,
      text: (t) => t.interactive.foreground.invert,
    },
    pressed: {
      background: (t) => t.interactive.background.primaryActive,
      text: (t) => t.interactive.foreground.invert,
    },
    disabled: {
      background: (t) => t.interactive.background.primaryDisabled,
      text: (t) => t.interactive.foreground.invert,
    },
  },
}

// Every variant but transparent has a 1 px border (transparent where it isn't
// drawn), so filled and outlined buttons line up. With the line heights below
// the paddings give the Figma heights: primary/outlined 48 (small 40),
// utility 40, transparent 28.
const layout: Record<Variant, ViewStyle> = {
  primary: { paddingVertical: 12, paddingHorizontal: 15, minWidth: 192 },
  outlined: { paddingVertical: 12, paddingHorizontal: 15, minWidth: 192 },
  transparent: { paddingVertical: 4, paddingHorizontal: 0 },
  utility: { paddingVertical: 11, paddingHorizontal: 15 },
  utilityFilled: { paddingVertical: 11, paddingHorizontal: 15 },
}

const smallPaddingVertical: Partial<Record<Variant, number>> = {
  primary: 8,
  outlined: 8,
}

const textStyles: Record<Variant, TextStyle> = {
  primary: { fontSize: 16, lineHeight: 22 },
  outlined: { fontSize: 16, lineHeight: 22 },
  // body2 · semibold
  transparent: { fontSize: 15, lineHeight: 20 },
  // eyebrow
  utility: { fontSize: 12, lineHeight: 16, letterSpacing: 0.16 },
  utilityFilled: { fontSize: 12, lineHeight: 16, letterSpacing: 0.16 },
}

const getVariant = ({
  isTransparent,
  isOutlined,
  isUtilityButton,
  isFilledUtilityButton,
}: ButtonBaseProps): Variant => {
  if (isFilledUtilityButton) {
    return 'utilityFilled'
  }
  if (isUtilityButton) {
    return 'utility'
  }
  if (isTransparent) {
    return 'transparent'
  }
  if (isOutlined) {
    return 'outlined'
  }
  return 'primary'
}

const Text = styled.Text<{ isUtility: boolean }>`
  font-family: ${fontByWeight('600')};
  text-align: ${({ isUtility }) => (isUtility ? 'left' : 'center')};
`

const Icon = styled.Image`
  width: 16px;
  height: 16px;
`

export function Button({
  title,
  isTransparent,
  isOutlined,
  isUtilityButton,
  isFilledUtilityButton,
  size = 'default',
  icon,
  style,
  textStyle,
  textProps,
  iconStyle,
  ellipsis,
  iconPosition = 'end',
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const theme = useTheme()
  const tokenColor = useTokenColor()
  const variant = getVariant({
    isTransparent,
    isOutlined,
    isUtilityButton,
    isFilledUtilityButton,
  })
  const isBordered = variant !== 'transparent'
  const radius = parseInt(theme.border.radius.large, 10)
  const isUtility = variant === 'utility' || variant === 'utilityFilled'
  const smallPadding =
    size === 'small' ? smallPaddingVertical[variant] : undefined

  const getColours = (pressed: boolean) =>
    colours[variant][
      disabled || loading ? 'disabled' : pressed ? 'pressed' : 'default'
    ]

  return (
    <Pressable
      disabled={disabled || loading}
      accessibilityState={{ disabled: !!(disabled || loading), busy: loading }}
      style={({ pressed }) => {
        const { background, border } = getColours(pressed)
        return [
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: radius,
            backgroundColor: background ? tokenColor(background) : undefined,
            ...(isBordered
              ? {
                  borderWidth: 1,
                  borderColor: border ? tokenColor(border) : 'transparent',
                }
              : {}),
            ...layout[variant],
            ...(smallPadding !== undefined
              ? { paddingVertical: smallPadding }
              : {}),
          },
          style,
        ]
      }}
      {...rest}
    >
      {({ pressed }) => {
        const { border, text } = getColours(pressed)
        const textColor = tokenColor(text)
        const renderIcon = () => (
          <Icon
            source={icon}
            resizeMode="center"
            style={{
              ...(variant === 'utilityFilled' ? { tintColor: textColor } : {}),
              ...iconStyle,
            }}
          />
        )

        return (
          <>
            {/* The outlined pressed border is 2 px. Drawing it over the 1 px
                border keeps the button from shifting while pressed. */}
            {variant === 'outlined' && pressed && border && (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: -1,
                  right: -1,
                  bottom: -1,
                  left: -1,
                  borderWidth: 2,
                  borderRadius: radius,
                  borderColor: tokenColor(border),
                }}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: theme.spacing.p1,
                // Let an ellipsized title shrink to the button's width rather
                // than overflowing it before it is truncated.
                ...(ellipsis ? { flexShrink: 1 } : {}),
                // Stays mounted while loading so the button keeps its size;
                // the dots are laid over it rather than replacing it.
                opacity: loading ? 0 : 1,
              }}
            >
              {icon && iconPosition === 'start' && renderIcon()}
              {title && (
                <Text
                  {...textProps}
                  isUtility={isUtility}
                  style={[
                    textStyles[variant],
                    { color: textColor },
                    ellipsis ? { flexShrink: 1 } : undefined,
                    textStyle,
                  ]}
                  numberOfLines={ellipsis ? 1 : undefined}
                  ellipsizeMode={ellipsis ? 'tail' : undefined}
                >
                  {title}
                </Text>
              )}
              {icon && iconPosition === 'end' && renderIcon()}
            </View>
            {loading && (
              <View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFillObject,
                  { justifyContent: 'center', alignItems: 'center' },
                ]}
              >
                <Text
                  isUtility={false}
                  style={[textStyles[variant], { color: textColor }]}
                >
                  • • •
                </Text>
              </View>
            )}
          </>
        )
      }}
    </Pressable>
  )
}
