import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { ImageSourcePropType, Text } from 'react-native'
import { fontByWeight } from '@ui/utils'

const Host = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue400};
  margin-bottom: 1px;
`

const variants = {
  small: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  large: { fontSize: 16, lineHeight: 20, fontWeight: '600' },
} as const

type LinkVariant = keyof typeof variants

interface LinkTextProps {
  children: string | React.ReactNode
  variant?: LinkVariant
  icon?: React.ReactNode | ImageSourcePropType
}

export function LinkText({ children, variant = 'large' }: LinkTextProps) {
  const theme = useTheme()
  const styles = variants[variant]
  const variantLineHeight = styles.lineHeight / styles.fontSize
  const lineHeight = styles.fontSize * variantLineHeight ?? styles.lineHeight
  const fontFamily = fontByWeight(styles.fontWeight)

  return (
    <Host>
      <Text
        style={{
          lineHeight,
          fontSize: styles.fontSize,
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
