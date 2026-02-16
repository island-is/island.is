import React, { useRef, useState } from 'react'
import {
  Animated,
  Image,
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useDynamicColor } from '../../utils'
import closeIcon from '../../assets/icons/close.png'
import searchIcon from '../../assets/icons/search.png'
import { font } from '../../utils/font'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

const Input = styled(AnimatedTextInput)<{
  pressed?: React.MutableRefObject<Animated.Value>
  focused?: boolean
}>`
  flex: 1;
  border-radius: ${({ theme }) => theme.spacing[1]}px;
  padding: ${({ theme }) => theme.spacing[1]}px 30px;
  min-height: 40px;

  ${font({ fontSize: 14 })}
`

interface SearchBarProps extends TextInputProps {
  onSearchPress?(): void
  onCancelPress?(): void
}

export function SearchBar(props: SearchBarProps) {
  const theme = useTheme()
  const inputRef = useRef<TextInput>(null)
  const [focus, setFocus] = useState(false)
  const pressed = useRef(new Animated.Value(0))
  const dynamicColor = useDynamicColor()

  const onRightIconPress = () => {
    props.onChangeText?.('')
    Keyboard.dismiss()
  }

  return (
    <View style={{ flex: 1, minHeight: 40 }}>
      <Input
        ref={inputRef}
        {...(props as TextInputProps)}
        pressed={pressed}
        focused={focus}
        onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
          setFocus(true)
          return props?.onFocus?.(e)
        }}
        onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
          setFocus(false)
          return props?.onBlur?.(e)
        }}
        onPressIn={() => {
          Animated.spring(pressed.current, {
            toValue: 1,
            useNativeDriver: false,
          }).start()
        }}
        onPressOut={() => {
          Animated.spring(pressed.current, {
            toValue: 0,
            useNativeDriver: false,
          }).start()
        }}
        keyboardType="web-search"
        placeholderTextColor={dynamicColor({
          dark: 'rgba(255, 255, 255, 0.6)',
          light: 'rgba(60, 60, 67, 0.6)',
        })}
        keyboardAppearance={theme.isDark ? 'dark' : 'light'}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          {
            color: theme.shade.foreground,
            backgroundColor: pressed.current.interpolate({
              inputRange: [0, 1],
              outputRange: [
                theme.isDark
                  ? 'rgba(255, 255, 255, 0.10)'
                  : 'rgba(118, 118, 128, 0.12)',
                theme.isDark
                  ? 'rgba(255, 255, 255, 0.16)'
                  : 'rgba(118, 118, 128, 0.24)',
              ],
              extrapolate: 'clamp',
            }),
          },
          props.style,
        ]}
      />
      <Image
        source={searchIcon}
        style={{
          position: 'absolute',
          top: 11,
          left: 7,
          width: 19,
          height: 19,
          tintColor: dynamicColor({
            dark: 'rgba(255, 255, 255, 0.6)',
            light: 'rgba(60, 60, 67, 0.6)',
          }),
        }}
      />
      {props.value?.length ? (
        <Pressable
          onPress={onRightIconPress}
          style={{
            position: 'absolute',
            top: 12,
            right: 8,
            backgroundColor: dynamicColor({
              dark: 'rgba(255, 255, 255, 0.6)',
              light: 'rgba(60, 60, 67, 0.6)',
            }),
            borderRadius: 16,
            padding: 1,
          }}
        >
          <Image
            source={closeIcon}
            style={{
              width: 14,
              height: 14,
              tintColor: dynamicColor({
                light: 'rgba(255, 255, 255, 0.8)',
                dark: 'rgba(60, 60, 67, 0.8)',
              }),
            }}
            resizeMode="contain"
          />
        </Pressable>
      ) : null}
    </View>
  )
}
