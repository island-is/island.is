import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { ImageSourcePropType, Text, TextStyle } from 'react-native'
import { fontByWeight } from '@ui/utils'

const Host = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue400};
  margin-bottom: 1px;
`

const variants = {
  small: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  large: { fontSize: 16, lineHeight: 20, fontWeight: '600' },
}

type LinkVariant = keyof typeof variants

interface LinkTextProps {
  children: string | React.ReactNode
  variant?: LinkVariant
  icon?: React.ReactNode | ImageSourcePropType
}

export function LinkText({ children, variant = 'large' }: LinkTextProps) {
  const theme = useTheme()
  const styles = (variants as Record<string, TextStyle>)[variant]
  const fontSize = styles.fontSize ?? 15
  const variantLineHeight = (styles.lineHeight ?? 1) / (styles.fontSize ?? 1)
  const lineHeight = fontSize * variantLineHeight ?? styles.lineHeight
  const fontFamily = fontByWeight(styles.fontWeight || '400')

  return (
    <Host>
      <Text
        style={{
          lineHeight,
          fontSize,
          fontFamily,
          color: theme.color.blue400,
          fontWeight: styles.fontWeight,
        }}
      >
        {children}
      </Text>
    </Host>
  )
}
