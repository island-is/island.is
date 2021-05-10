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

const Dot = styled(Animated.View)<{ state?: 'active' | 'inactive' | 'error' }>`
  position: absolute;
  top: 0;
  left: 0;

  width: 16px;
  height: 16px;

  border-radius: 8px;

  background-color: ${props => props.state === 'active' ? props.theme.color.blue400 : props.state === 'inactive' ? props.theme.color.blue100 : props.theme.color.red400};
`;

const DotGroup = styled.View`
  position: relative;
  width: 16px;
  height: 16px;
  margin: 0px 8px;
`;

export function VisualizedPinCode({ code, invalid, minChars = 4, maxChars = 6 }: VisualizedPinCodeProps) {
  const charsCount = Math.max(minChars, Math.min(maxChars, code.length));
  const value = useRef(new Animated.Value(0));
  const animation = useRef<Animated.CompositeAnimation>();
  const colorAnimation = useRef<Animated.CompositeAnimation>();

  const opacityForError = useRef(new Animated.Value(0));
  const colors = useRef(
      Array.from({ length: maxChars })
        .map((n, i) => new Animated.Value(i < code.length ? 1 : 0))
    );

  const shake = useCallback(() => {
    if (animation.current) {
      animation.current.stop();
    }

    Animated.spring(opacityForError.current, { toValue: 1, useNativeDriver: true }).start();

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

    Animated.spring(opacityForError.current, { toValue: 0, useNativeDriver: true }).start();

    colorAnimation.current = Animated.parallel(
      colors.current.map((color, i) => Animated.spring(color, { toValue: i < code.length ? 1 : 0, useNativeDriver: false }))
    );

    colorAnimation.current.start();
  }, [code]);

  return (
    <Host style={{ transform: [{ translateX: value.current }] }}>
      {Array.from({ length: charsCount }).map((n, i) => (
        <DotGroup key={i}>
          <Dot state="inactive" />
          <Dot state="active" style={{ opacity: colors.current[i] }} />
          <Dot state="error" style={{ opacity: opacityForError.current }} />
        </DotGroup>
      ))}
    </Host>
  );
}
