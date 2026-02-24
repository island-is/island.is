import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Image, View } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'

import warningIcon from '@/ui/assets/icons/warning.png'
import errorIcon from '@/ui/assets/icons/error.png'
import infoIcon from '@/ui/assets/icons/info.png'
import successIcon from '@/ui/assets/icons/check.png'
import { screenWidth } from '@/utils/dimensions'
import { Typography } from '@/ui'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export const toastSchemes = {
  success: {
    backgroundColor: 'mint100',
    borderColor: 'mint200',
    icon: successIcon,
    iconColor: 'mint400',
  },
  info: {
    backgroundColor: 'blue100',
    borderColor: 'blue200',
    icon: infoIcon,
    iconColor: 'blue400',
  },
  warning: {
    backgroundColor: 'yellow200',
    borderColor: 'yellow400',
    icon: warningIcon,
    iconColor: 'yellow600',
  },
  error: {
    backgroundColor: 'red100',
    borderColor: 'red200',
    icon: errorIcon,
    iconColor: 'red400',
  },
} as const

const Host = styled(Animated.View)<{
  backgroundColor: string
  borderColor: string
}>`
  height: 52px;
  position: absolute;
  bottom: ${({ theme }) => theme.spacing[2]}px;
  right: ${({ theme }) => theme.spacing[2]}px;
  border: 1px solid ${({ borderColor }) => borderColor};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${({ theme }) => theme.border.radius.large};
  padding-vertical: ${({ theme }) => theme.spacing[1]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[1]}px;
  flex-direction: row;
  justify-content: space-between;
`

const Content = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

export const Toast = ({
  visible,
  duration = 2000,
  onHide,
  variant,
  title,
  message,
}: {
  visible: boolean
  duration?: number
  onHide?: () => void
  variant: ToastVariant
  title?: string
  message?: string
}) => {
  const theme = useTheme()
  const toastVariant = toastSchemes[variant]

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onHide?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible])

  if (!visible) {
    return null
  }

  return (
    <Host
      style={{ width: screenWidth - theme.spacing[4] }}
      entering={FadeInDown}
      exiting={FadeOutDown}
      borderColor={theme.color[toastVariant.borderColor]}
      backgroundColor={theme.color[toastVariant.backgroundColor]}
    >
      <Content>
        <Image
          source={toastVariant.icon}
          style={{
            width: 16,
            height: 16,
            tintColor: theme.color[toastVariant.iconColor],
          }}
          resizeMode="contain"
        />
        <View>
          {title && <Typography variant={'eyebrow'}>{title}</Typography>}
          {message && <Typography variant={'body3'}>{message}</Typography>}
        </View>
      </Content>
    </Host>
  )
}
