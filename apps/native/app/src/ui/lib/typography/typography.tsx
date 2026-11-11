import React from 'react'
import { Text, TextProps, TextStyle, useWindowDimensions } from 'react-native'
import { fontByWeight, useTokenColor } from '../../utils'

export const variants = {
  heading1: { fontSize: 32, lineHeight: 38, fontWeight: '600' },
  heading2: { fontSize: 28, lineHeight: 34, fontWeight: '600' },
  heading3: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  heading4: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  heading5: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '300' },
  body2: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  body3: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0.16,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.16,
  },
}

export type TypographyVariant = keyof typeof variants

// How far each variant grows with the system text size. Capped by base size,
// not role: 20pt and under follows up to 200 %, while the two largest stop at
// 150 % so they don't crowd out the content. No style outgrows a larger one.
const maxFontScale: Record<TypographyVariant, number> = {
  heading1: 1.5,
  heading2: 1.5,
  heading3: 2,
  heading4: 2,
  heading5: 2,
  body: 2,
  body2: 2,
  body3: 2,
  eyebrow: 2,
}

/**
 * How far text grows with the system text size, capped at
 * maxFontSizeMultiplier. Text using it sets allowFontScaling={false} and
 * multiplies its own sizes. Natively, Android scales fontSize and lineHeight
 * separately (non-linearly from Android 14), so enlarged text clips, and iOS
 * lays out text capped by maxFontSizeMultiplier at its uncapped size.
 */
export const useFontScale = (
  maxFontSizeMultiplier?: number | null,
  allowFontScaling = true,
) => {
  const { fontScale } = useWindowDimensions()
  if (!allowFontScaling) {
    return 1
  }
  // As in React Native, a cap below 1 means no cap.
  if (maxFontSizeMultiplier && maxFontSizeMultiplier >= 1) {
    return Math.min(fontScale, maxFontSizeMultiplier)
  }
  return fontScale
}

interface TypographyProps extends TextProps {
  variant?: TypographyVariant
  weight?: TextStyle['fontWeight']
  size?: TextStyle['fontSize']
  color?: TextStyle['color']
  textAlign?: TextStyle['textAlign']
  lineHeight?: number
}

export function Strong({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontFamily: fontByWeight('600'), fontWeight: '600' }}>
      {children}
    </Text>
  )
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
  allowFontScaling = true,
  maxFontSizeMultiplier = maxFontScale[variant],
  ...rest
}: TypographyProps) {
  const tokenColor = useTokenColor()
  const scale = useFontScale(maxFontSizeMultiplier, allowFontScaling)
  const styles = (variants as Record<string, TextStyle>)[variant]
  const fontFamily = fontByWeight(weight || styles.fontWeight || '400')
  const baseFontSize = size ?? styles.fontSize ?? 15
  const variantLineHeight = (styles.lineHeight ?? 1) / (styles.fontSize ?? 1)
  const baseLineHeight =
    overwriteLineHeight ??
    (size ? baseFontSize * variantLineHeight : styles.lineHeight)
  const fontSize = baseFontSize * scale
  const lineHeight = baseLineHeight && baseLineHeight * scale
  const letterSpacing = styles.letterSpacing && styles.letterSpacing * scale
  const textColor = color ?? tokenColor((t) => t.foreground.primary)

  return (
    <Text
      {...rest}
      allowFontScaling={false}
      style={[
        {
          lineHeight,
          fontSize,
          fontFamily,
          color: textColor,
          textAlign,
          letterSpacing,
          fontWeight: weight ?? styles.fontWeight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
