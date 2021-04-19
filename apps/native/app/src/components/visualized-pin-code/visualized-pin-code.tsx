import React, { useCallback, useEffect } from 'react';
import styled, { useTheme } from "styled-components/native";
import { Animated } from 'react-native';
import { useRef } from 'react';
import { useState } from 'react';

interface VisualizedPinCodeProps {
  code: string;
  invalid: boolean;
  minChars?: number;
  maxChars?: number;
}

const Host = styled(Animated.View)`
  flex-direction: row;
`;

const Dot = styled(Animated.View)`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin: 0px 8px;
`;

// convert hex values to rgb for Animated
function hexToRGB(hex: string) {
  const r = parseInt(`0x${hex[1]}${hex[2]}`, 16);
  const g = parseInt(`0x${hex[3]}${hex[4]}`, 16);
  const b = parseInt(`0x${hex[5]}${hex[6]}`, 16);
  return `rgb(${r},${g},${b})`;
}

export function VisualizedPinCode({ code, invalid, minChars = 4, maxChars = 6 }: VisualizedPinCodeProps) {
  const theme = useTheme();
  const charsCount = Math.max(minChars, Math.min(maxChars, code.length));
  const value = useRef(new Animated.Value(0));
  const animation = useRef<Animated.CompositeAnimation>();
  const colorAnimation = useRef<Animated.CompositeAnimation>();
  const colors = useRef(
    Array.from({ length: maxChars })
      .map((n, i) => new Animated.Value(i < code.length ? 1 : 0))
  );

  const inputRange = [-1, 0, 1];
  const outputRange = useRef([hexToRGB(theme.color.red400), hexToRGB(theme.color.blue100), hexToRGB(theme.color.blue400)]);

  const shake = useCallback(() => {
    if (animation.current) {
      animation.current.stop();
    }

    colors.current.forEach((color, i) => color.setValue(-1));

    value.current.setValue(0);

    animation.current = Animated.sequence([
      Animated.spring(value.current, { toValue: 10, useNativeDriver: true, overshootClamping: true, tension: 300 }),
      Animated.spring(value.current, { toValue: -10, useNativeDriver: true, overshootClamping: true, tension: 250 }),
      Animated.spring(value.current, { toValue: 10, useNativeDriver: true, overshootClamping: true, tension: 250 }),
      Animated.spring(value.current, { toValue: -10, useNativeDriver: true, overshootClamping: true, tension: 250 }),
      Animated.spring(value.current, { toValue: 0, useNativeDriver: true, overshootClamping: true, tension: 100 }),
      Animated.delay(330)
    ]);

    animation.current.start();
  }, []);

  useEffect(() => {
    if (invalid) {
      shake();
    }
  }, [invalid]);

  useEffect(() => {
    colorAnimation.current = Animated.parallel(
      colors.current.map((color, i) => Animated.spring(color, { toValue: i < code.length ? 1 : 0, useNativeDriver: false }))
    );

    colorAnimation.current.start();
  }, [code]);

  return (
    <Host style={{ transform: [{ translateX: value.current }] }}>
      {Array.from({ length: charsCount }).map((n, i) => (
        <Dot key={i} style={{ backgroundColor: colors.current[i].interpolate({ inputRange, outputRange: outputRange.current }) }} />
      ))}
    </Host>
  );
}
