import { theme } from '@island.is/island-ui/theme'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { uiStore, useUiStore } from '../../stores/ui-store'

interface NavigationBarTitleProps {
  title: string
}

export const NavigationBarTitle = ({ title }: NavigationBarTitleProps) => {
  const { width, height } = useWindowDimensions();
  const [{ frame, insets }, set] = useState(uiStore.getState());
  const useShort = width > height && height < 768;

  useEffect(() => {
    const cancel = uiStore.subscribe((state: any) => {
      requestAnimationFrame(() => set(state));
    }, state => state);
    return () => {
      cancel();
    }
  }, []);

  const ml = Math.max(12, insets.left);
  const mr = Math.max(12, insets.right);

  return (
    <View
      style={{
        justifyContent: 'flex-start',
        width: width + ml + mr, // - Math.max(24, insets.left) - Math.max(24, insets.right),
        // backgroundColor: 'red',
        marginLeft: -ml,
        marginRight: -mr
      }}
    >
      <Text
        style={{
          color: theme.color.dark400,
          fontFamily: 'IBMPlexSans-SemiBold',
          fontSize: 21,
          fontWeight: '600',
          marginLeft: 24,
        }}
      >
        {title}
      </Text>
    </View>
  )
}
