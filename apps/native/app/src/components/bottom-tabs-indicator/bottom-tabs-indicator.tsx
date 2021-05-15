import { theme } from '@island.is/island-ui/theme'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Animated, View } from 'react-native'
import { useTheme } from 'styled-components';
import { uiStore } from '../../stores/ui-store'

export function BottomTabsIndicator({
  index,
  total,
}: {
  index: number
  total: number
}) {
  const theme = useTheme();
  const win = useWindowDimensions();
  const [first, setFirst] = useState(true);
  const [{ selectedTab, unselectedTab }, set] = useState(uiStore.getState());

  const [width, setWidth] = useState(win.width);

  const p = 1.0;
  const h = (1.0 - p) / 2;
  const av = useRef(new Animated.Value(index)).current;
  const landscape = win.width > win.height;
  // const insetLeft = Math.max(insets.left, landscape ? 96 : 16);
  // const insetRight = Math.max(insets.right, landscape ? 96 : 16);
  // const frameWidth = (win.width);
  const tabWidth = width / total;

  useEffect(() => {
    const cancel = uiStore.subscribe((state: any) => {
      requestAnimationFrame(() => set(state));
    }, state => state);
    return () => {
      cancel();
    }
  }, []);

  useEffect(() => {
    if (first) {
      setFirst(false);
      if (index === selectedTab && unselectedTab === 0) {
        av.setValue(selectedTab);
        return;
      }
    }
    av.setValue(unselectedTab);
    Animated.spring(av, {
      overshootClamping: true,
      toValue: selectedTab,
      useNativeDriver: true,
    }).start();
  }, [selectedTab, unselectedTab]);

  useEffect(() => {
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        bottom: -29,
        left: 0,
        right: 0,
        height: 30,
        zIndex: 1000,
        shadowColor: theme.color.blue400,
        shadowOffset: {
          width: 0,
          height: -26,
        },
        shadowOpacity: 0.08,
        shadowRadius: 30.0,
        backgroundColor: theme.shade.background,
      }}
    >
      <SafeAreaView>
        <View
          onLayout={e => {
            setWidth(e.nativeEvent.layout.width);
          }}
        >
          <Animated.View
            style={
              {
                width: tabWidth * p,
                height: 1,
                backgroundColor: theme.color.blue400,
                transform: [{
                  translateX: av.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, (tabWidth * 4 * h) + (tabWidth * p), (tabWidth * 8 * h) + (tabWidth * p * 2)]
                  })
                }]
              }
            }
          />
        </View>
      </SafeAreaView>
    </View>
  )
}
