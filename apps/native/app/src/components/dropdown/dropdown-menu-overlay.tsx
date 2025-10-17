import React, { ReactNode, useEffect } from 'react'
import {
  NavigationFunctionComponent,
  Navigation,
} from 'react-native-navigation'
import { Pressable, View, SafeAreaView, Platform } from 'react-native'

import { theme } from '../../ui'
import {
  getDropdownContent,
  clearDropdownContent,
} from './dropdown-content-registry'
import { DropdownOverlayProvider } from './dropdown-overlay-context'

export interface DropdownMenuOverlayProps {
  children?: ReactNode
  contentId?: string
}

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
    <Pressable
      onPress={handleClose}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'transparent',
      }}
    >
      <SafeAreaView
        pointerEvents="box-none"
        style={{ backgroundColor: 'transparent', flex: 1 }}
      >
        <View
          pointerEvents="box-none"
          style={{
            flex: 1,
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              marginTop: theme.spacing[5],
              marginRight: theme.spacing[1],
              shadowRadius: 30,
              shadowColor: '#0061FF',
              shadowOpacity: 0.16,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
              backgroundColor: Platform.select({
                android: theme.color.white,
                default: 'transparent',
              }),
            }}
          >
            <DropdownOverlayProvider
              value={{ componentId, close: handleClose }}
            >
              <View
                style={{
                  minWidth: 150,
                  backgroundColor: theme.color.white,
                  borderRadius: 8,
                }}
              >
                {children ?? (contentId ? getDropdownContent(contentId) : null)}
              </View>
            </DropdownOverlayProvider>
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
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
