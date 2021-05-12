import { theme } from '@island.is/island-ui/theme'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Text } from 'react-native';
import { Dimensions } from 'react-native';
import { Animated, View } from 'react-native'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { uiStore } from '../../stores/ui-store'

export function BottomTabsIndicator({
  index,
  total,
}: {
  index: number
  total: number
}) {
  const win = useWindowDimensions();
  const [first, setFirst] = useState(true);
  const [{ insets, selectedTab, unselectedTab }, set] = useState(uiStore.getState());

  const p = 1.0;
  const h = (1.0 - p) / 2;
  const av = useRef(new Animated.Value(index)).current;
  const landscape = win.width > win.height;
  const insetLeft = Math.max(insets.left, landscape ? 96 : 16);
  const insetRight = Math.max(insets.right, landscape ? 96 : 16);
  const frameWidth = (win.width - insetLeft - insetRight);
  const width = frameWidth / total;

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
        backgroundColor: 'white',
        shadowColor: 'rgba(0, 97, 255, 1)',
        shadowOffset: {
          width: 0,
          height: -26,
        },
        shadowOpacity: 0.08,
        shadowRadius: 30.0,
      }}
    >
      <View style={{ marginLeft: insetLeft, marginRight: insetRight }}>
        <Animated.View
          style={
            {
              width: width * p,
              height: 1,
              backgroundColor: theme.color.blue400,
              transform: [{
                translateX: av.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, (width * 4 * h) + (width * p), (width * 8 * h) + (width * p * 2)]
                })
              }]
            }
          }
        />
      </View>
    </View>
  )
}
