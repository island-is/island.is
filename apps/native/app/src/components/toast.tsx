import React, { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Image, Keyboard, Platform, View } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePathname } from 'expo-router'
import { create, useStore } from 'zustand'

import warningIcon from '@/ui/assets/icons/warning.png'
import errorIcon from '@/ui/assets/icons/error.png'
import infoIcon from '@/ui/assets/icons/info.png'
import successIcon from '@/ui/assets/icons/check.png'
import { screenWidth } from '@/utils/dimensions'
import { Typography } from '@/ui'
import { useUiStore } from '@/stores/ui-store'

const TAB_BAR_CONTENT_HEIGHT = Platform.select({
  ios: 49,
  android: 56,
  default: 0,
})

const TAB_ROUTE_PREFIXES = ['/inbox', '/wallet', '/health', '/more']

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
  bottomOffset: number
}>`
  height: 52px;
  position: absolute;
  bottom: ${({ theme, bottomOffset }) => theme.spacing[2] + bottomOffset}px;
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
  bottomOffset = 0,
}: {
  visible: boolean
  duration?: number
  onHide?: () => void
  variant: ToastVariant
  title?: string
  message?: string
  bottomOffset?: number
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
      bottomOffset={bottomOffset}
    >
      <Content>
        <Image
          source={toastVariant.icon}
          style={{
            width: 24,
            height: 24,
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

type ActiveToast = {
  id: number
  variant: ToastVariant
  title?: string
  message?: string
  duration?: number
}

type ShowPayload = {
  variant: ToastVariant
  title?: string
  message?: string
  duration?: number
}

type ShowOptions = {
  message?: string
  duration?: number
}

type ToastStore = {
  current: ActiveToast | null
}

export const toastStore = create<ToastStore>(() => ({
  current: null,
}))

export const useToastStore = <U = ToastStore>(
  selector?: (state: ToastStore) => U,
) => useStore(toastStore, selector!)

let nextId = 1

const show = (payload: ShowPayload): number => {
  const id = nextId++
  toastStore.setState({ current: { id, ...payload } })
  return id
}

const hide = (id?: number) => {
  const current = toastStore.getState().current
  if (!current) {
    return
  }
  if (id !== undefined && current.id !== id) {
    return
  }
  toastStore.setState({ current: null })
}

const variantShortcut =
  (variant: ToastVariant) =>
  (title: string, options?: ShowOptions): number =>
    show({ variant, title, ...options })

export const toast = {
  show,
  hide,
  success: variantShortcut('success'),
  error: variantShortcut('error'),
  warning: variantShortcut('warning'),
  info: variantShortcut('info'),
}

const useKeyboardHeight = () => {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setHeight(e.endCoordinates?.height ?? 0)
    })
    const hideSub = Keyboard.addListener(hideEvent, () => setHeight(0))
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  return height
}

export const ToastHost = () => {
  const current = useToastStore((state) => state.current)
  const tabsHidden = useUiStore((state) => state.tabsHidden)
  const insets = useSafeAreaInsets()
  const pathname = usePathname()
  const keyboardHeight = useKeyboardHeight()

  if (!current) {
    return null
  }

  const isOnTabRoute =
    pathname === '/' ||
    TAB_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  const tabsVisible =
    isOnTabRoute && !(tabsHidden && Platform.OS === 'ios')
  const tabBarOffset = tabsVisible
    ? TAB_BAR_CONTENT_HEIGHT + insets.bottom
    : 0
  // Keyboard reports height from screen bottom (includes safe area on iOS).
  // When the keyboard is up it covers the tab bar, so we use whichever offset
  // pushes the toast higher.
  const bottomOffset = Math.max(tabBarOffset, keyboardHeight)

  return (
    <Toast
      key={current.id}
      visible
      variant={current.variant}
      title={current.title}
      message={current.message}
      duration={current.duration}
      bottomOffset={bottomOffset}
      onHide={() => hide(current.id)}
    />
  )
}
