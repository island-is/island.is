import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Animated, Dimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

interface TabBarProps {
  values: string[];
  selectedIndex: number;
  onChange(index: number): void;
}

const Host = styled.SafeAreaView`
  margin-left: 16px;
  margin-right: 16px;
`;

const Tabs = styled.View`
  flex-direction: row;
`;

const Tab = styled.TouchableOpacity`
  flex: 1;
  padding: 15px;
  align-items: center;
  justify-content: center;
`;

const TabTitle = styled(Animated.Text)`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 12px;
  line-height: 16px;
`;

const Line = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${props => props.theme.color.blue200};
`;

const ActiveLine = styled(Animated.View)`
  width: 50%;
  height: 1px;
  background-color: ${props => props.theme.color.blue400};
`;

function hexToRGB(hex: string) {
  const r = parseInt(`0x${hex[1]}${hex[2]}`, 16);
  const g = parseInt(`0x${hex[3]}${hex[4]}`, 16);
  const b = parseInt(`0x${hex[5]}${hex[6]}`, 16);
  return `rgb(${r},${g},${b})`;
}

export function TabBar(props: TabBarProps) {
  const { values, selectedIndex, onChange } = props;
  const theme = useTheme();
  const animatedIndexNative = useRef(new Animated.Value(selectedIndex));
  const animatedIndex = useRef(new Animated.Value(selectedIndex));
  const tabsRef = useRef<View>(null);
  const tabWidth = useRef(new Animated.Value(100));
  const indexes = useRef(new Map<number, Animated.Value>());

  const animateIndex = (toValue: number) => {
    Animated.spring(animatedIndexNative.current, { toValue, useNativeDriver: true, overshootClamping: true }).start();
    Animated.spring(animatedIndex.current, { toValue, useNativeDriver: false }).start();
  }

  useEffect(() => {
    tabsRef.current?.measure((x, y, width) => {
      const w = Math.round(width / values.length);
      tabWidth.current.setValue(w);
    });
  }, [values]);

  useEffect(() => {
    animateIndex(selectedIndex);
  }, [selectedIndex]);

  const inputRange = [-1, 0, 1];
  const outputRange = useRef([hexToRGB(theme.color.dark400), hexToRGB(theme.color.blue400), hexToRGB(theme.color.dark400)]);

  return (
    <Host>
      <Tabs ref={tabsRef as any}>
        {values.map((item, i) => {
          if (!indexes.current.has(i)) {
            indexes.current.set(i, new Animated.Value(i));
          }
          return (
          <Tab
            key={item+i}
            onPress={() => {
              onChange(i);
              animateIndex(i);
            }}
          >
            <TabTitle
              style={{
                color: Animated.subtract(animatedIndex.current, indexes.current.get(i)!).interpolate({ inputRange, outputRange: outputRange.current }),
              }}
            >
              {item}
            </TabTitle>
          </Tab>
        );
            })}
      </Tabs>
      <Line>
        <ActiveLine
          style={{
            width: `${(1 / values.length * 100).toFixed(2)}%`,
            transform: [{ translateX: Animated.multiply(animatedIndexNative.current, tabWidth.current) }],
          }}
        />
      </Line>
    </Host>
  )
}
