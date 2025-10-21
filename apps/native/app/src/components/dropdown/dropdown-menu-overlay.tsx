import React, { ReactNode, useEffect } from 'react'
import {
  NavigationFunctionComponent,
  Navigation,
} from 'react-native-navigation'
import { Pressable, View, SafeAreaView, Platform } from 'react-native'
import styled from 'styled-components/native'

import {
  getDropdownContent,
  clearDropdownContent,
} from './dropdown-content-registry'
import { DropdownOverlayProvider } from './dropdown-overlay-context'

export interface DropdownMenuOverlayProps {
  children?: ReactNode
  contentId?: string
}

const OverlayPressable = styled(Pressable)({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'transparent',
})

const OverlaySafeArea = styled(SafeAreaView).attrs({
  pointerEvents: 'box-none' as const,
})(() => ({
  backgroundColor: 'transparent',
  flex: 1,
}))

const ContentContainer = styled(View).attrs({
  pointerEvents: 'box-none' as const,
})(() => ({
  flex: 1,
  alignItems: 'flex-end',
}))

const DropdownWrapper = styled(View)(({ theme }) => ({
  marginTop: theme.spacing[5],
  marginRight: theme.spacing[1],
  shadowRadius: 30,
  shadowColor: theme.color.blue400,
  shadowOpacity: 0.16,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
  backgroundColor:
    Platform.OS === 'android' ? theme.color.white : 'transparent',
}))

const Dropdown = styled(View)(({ theme }) => ({
  minWidth: 150,
  backgroundColor: theme.color.white,
  borderRadius: 8,
}))

export const DropdownMenuOverlay: NavigationFunctionComponent<
  DropdownMenuOverlayProps
> = ({ componentId, children, contentId }) => {
  const handleClose = () => {
    void Navigation.dismissOverlay(componentId)
  }

  useEffect(() => {
    return () => {
      if (contentId) clearDropdownContent(contentId)
    }
  }, [contentId])

  return (
    <OverlayPressable onPress={handleClose}>
      <OverlaySafeArea>
        <ContentContainer>
          <DropdownWrapper>
            <DropdownOverlayProvider
              value={{ componentId, close: handleClose }}
            >
              <Dropdown>
                {children ?? (contentId ? getDropdownContent(contentId) : null)}
              </Dropdown>
            </DropdownOverlayProvider>
          </DropdownWrapper>
        </ContentContainer>
      </OverlaySafeArea>
    </OverlayPressable>
  )
}

DropdownMenuOverlay.options = {
  layout: {
    componentBackgroundColor: 'transparent',
    backgroundColor: 'transparent',
  },
  overlay: {
    interceptTouchOutside: true,
    handleKeyboardEvents: true,
  },
}
