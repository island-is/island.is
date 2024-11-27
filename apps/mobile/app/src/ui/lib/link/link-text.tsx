import React from 'react'
import { Image } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { ImageSourcePropType, Text } from 'react-native'
import { fontByWeight } from '@ui/utils'

const Host = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue400};
  padding-bottom: 2px;
  align-items: center;
  flex-direction: row;
`

const variants = {
  small: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  large: { fontSize: 16, lineHeight: 20, fontWeight: '600' },
} as const

type LinkVariant = keyof typeof variants

interface LinkTextProps {
  children: string | React.ReactNode
  variant?: LinkVariant
  icon?: ImageSourcePropType
}

export function LinkText({ children, variant = 'large', icon }: LinkTextProps) {
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
      {icon && (
        <Image source={icon} style={{ paddingBottom: 1, marginLeft: 3 }} />
      )}
    </Host>
  )
}
