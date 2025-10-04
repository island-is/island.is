import React, { ReactNode, useEffect } from 'react'
import {
  NavigationFunctionComponent,
  Navigation,
} from 'react-native-navigation'
import { Pressable, View, SafeAreaView } from 'react-native'

import { theme } from '../../ui'
import {
  getDropdownContent,
  clearDropdownContent,
} from './dropdown-content-registry'

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
            // backgroundColor: 'blue',
          }}
        >
          <View
            style={{
              marginTop: theme.spacing[5],
              marginRight: theme.spacing[1],
              shadowColor: '#0061FF',
              shadowOpacity: 0.16,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 30,
              elevation: 6,
            }}
          >
            <Pressable
              onPress={() => {}}
              style={{
                minWidth: 150,
                backgroundColor: theme.color.white,
                borderRadius: 8,
              }}
            >
              {children ?? (contentId ? getDropdownContent(contentId) : null)}
            </Pressable>
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
