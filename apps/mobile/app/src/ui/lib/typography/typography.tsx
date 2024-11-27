import React from 'react'
import { Text, TextProps, TextStyle } from 'react-native'
import { fontByWeight, useDynamicColor } from '../../utils'

export const variants = {
  heading1: { fontSize: 32, lineHeight: 38, fontWeight: '600' },
  heading2: { fontSize: 26, lineHeight: 32, fontWeight: '600' },
  heading3: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  heading4: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  heading5: { fontSize: 16, lineHeight: 20, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '300' },
  body2: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  body3: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  eyebrow: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
}

export type TypographyVariant = keyof typeof variants

interface TypographyProps extends TextProps {
  variant?: TypographyVariant
  weight?: TextStyle['fontWeight']
  size?: TextStyle['fontSize']
  color?: TextStyle['color']
  textAlign?: TextStyle['textAlign']
  lineHeight?: number
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontWeight: 'bold' }}>{children}</Text>
}

export function Typography({
  children,
  variant = 'body',
  textAlign,
  weight,
  color,
  size,
  style,
  lineHeight: overwriteLineHeight,
  ...rest
}: TypographyProps) {
  const dynamicColor = useDynamicColor()
  const styles = (variants as Record<string, TextStyle>)[variant]
  const fontFamily = fontByWeight(weight || styles.fontWeight || '400')
  const fontSize = size ?? styles.fontSize ?? 15
  const variantLineHeight = (styles.lineHeight ?? 1) / (styles.fontSize ?? 1)
  const lineHeight =
    overwriteLineHeight ?? size
      ? fontSize * variantLineHeight
      : styles.lineHeight
  const textColor =
    color ??
    dynamicColor({
      light: dynamicColor.theme.shades.light.foreground,
      dark: dynamicColor.theme.shades.dark.foreground,
    })

  return (
    <Text
      {...rest}
      style={[
        {
          lineHeight,
          fontSize,
          fontFamily,
          color: textColor,
          textAlign,
          fontWeight: weight ?? styles.fontWeight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
