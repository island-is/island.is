import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import closeIcon from '../../assets/icons/close.png'
import { useTokenColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.Pressable`
  overflow: hidden;
  flex-direction: row;
  gap: 4px;
  border-radius: ${({ theme }) => theme.border.radius.standard};
  align-items: center;
  justify-content: center;
  padding: 8px;
`

const Text = styled.Text`
  ${font({
    fontSize: 14,
    fontWeight: '600',
    color: ({ theme }) => theme.tokens.interactive.foreground.primary,
  })}
`

interface TagProps {
  title: string
  onClose?(): void
  closable?: boolean
  onPress?(): void
  active?: boolean
}

export function Tag({ title, closable, onClose, onPress, active }: TagProps) {
  const tokenColor = useTokenColor()
  return (
    <Host
      onPress={onClose || onPress}
      style={({ pressed }) => ({
        backgroundColor: tokenColor(
          active
            ? (t) => t.interactive.background.primary
            : pressed
            ? (t) => t.interactive.background.primaryMinimalActive
            : (t) => t.interactive.background.primaryMinimal,
        ),
      })}
    >
      <Text
        style={{
          color: tokenColor(
            active
              ? (t) => t.interactive.foreground.invert
              : (t) => t.interactive.foreground.primary,
          ),
        }}
      >
        {title}
      </Text>
      {closable && (
        <Image
          source={closeIcon}
          style={{ width: 16, height: 16, marginTop: 1 }}
        />
      )}
    </Host>
  )
}
