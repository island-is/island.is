import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

const Dots = styled.View`
  flex-direction: row;
  width: 100%;
  height: 24px;
  justify-content: center;
`;

const Dot = styled(Animated.View)<{ active?: boolean; }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin-right: ${props => props.active ? 0 : 4}px;
  background-color: ${props => props.active ? props.theme.color.purple400 : props.theme.color.purple200};
`;

interface ViewPagerProps {
  itemWidth?: number;
  children: React.ReactNode;
}

export function ViewPager({ children, itemWidth }: ViewPagerProps) {

  const pages = React.Children.count(children);
  const OFFSET_X = 16;
  const OFFSET_CARD = itemWidth ?? 283
  const OFFSET = OFFSET_X + OFFSET_CARD;

  const [contentWidth, setContentWidth] = useState(pages*OFFSET-OFFSET_X);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  const x = useRef(new Animated.Value(0)).current;

  return (
    <>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{
            nativeEvent: {
              contentOffset: {
                x,
              },
            },
          }],
          { useNativeDriver: true },
        )}
        contentInset={{
          left: 0,
          right: 16,
        }}
        onLayout={(e) => setScrollViewWidth(e.nativeEvent.layout.width)}
        onContentSizeChange={setContentWidth}
        horizontal={true}
        snapToInterval={OFFSET}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'start'}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        decelerationRate={0}
      >
        {children}
      </Animated.ScrollView>
      <Dots>
        {Array.from({ length: pages }).map((_, i) => (
          <Dot key={i}>
            <Dot
              active
              style={{
                opacity: x.interpolate({
                  inputRange: i === pages - 1 ? [contentWidth-OFFSET-OFFSET_CARD, contentWidth-OFFSET-60, contentWidth-120] : [(OFFSET*i)-OFFSET, OFFSET*i, i === pages - 2 ? contentWidth-OFFSET-60 : (OFFSET*i)+OFFSET],
                  outputRange: [0, 1, 0]
                })
              }}
            />
          </Dot>
        ))}
      </Dots>
    </>
  )
}
