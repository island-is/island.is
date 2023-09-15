import React, {useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import closeIcon from '../../assets/icons/close.png';
import searchIcon from '../../assets/icons/search.png';
import {dynamicColor} from '../../utils';
import {font} from '../../utils/font';

const Host = styled.View`
  flex-direction: row;
  z-index: 10;
`;

const SearchIcon = styled.Image`
  z-index: 100;
  position: absolute;
  right: 12px;
  top: ${({theme}) => theme.spacing[1]}px;
  width: ${({theme}) => theme.spacing[3]}px;
  height: ${({theme}) => theme.spacing[3]}px;
`;

const Input = styled.TextInput`
  flex: 1;
  background-color: ${dynamicColor(({theme}) => ({
    dark: theme.shades.dark.shade100,
    light: theme.color.blue100,
  }))};
  border-color: ${dynamicColor(
    ({theme}) => ({
      dark: theme.shades.dark.shade300,
      light: theme.color.blue200,
    }),
    true,
  )};
  border-width: ${({theme}) => theme.border.width.standard}px;
  border-radius: ${({theme}) => theme.spacing[1]}px;
  padding: ${({theme}) => theme.spacing[1]}px ${({theme}) => theme.spacing[2]}px;

  ${font()}
`;

interface SearchBarProps extends TextInputProps {
  onSearchPress?(): void;
  onCancelPress?(): void;
}

export function SearchBar(props: SearchBarProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focus, setFocus] = useState(false);
  const isEmpty = (props.value || '') === '';

  const onRightIconPress = () => {
    if (!isEmpty) {
      if (inputRef.current) {
        inputRef.current.blur();
      }
      if (props.onCancelPress) {
        props.onCancelPress();
      }
    } else {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <View>
      <Host>
        <Input
          ref={inputRef}
          {...(props as any)}
          onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setFocus(true);
            return props?.onFocus?.(e);
          }}
          onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setFocus(false);
            return props?.onBlur?.(e);
          }}
          keyboardType="web-search"
          placeholderTextColor={
            theme.isDark ? theme.shade.shade700 : theme.color.dark300
          }
          keyboardAppearance={theme.isDark ? 'dark' : 'light'}
          style={{color: theme.shade.foreground}}
        />
      </Host>
      <Pressable
        onPress={onRightIconPress}
        style={{
          position: 'absolute',
          zIndex: 40,
          top: 2,
          right: 0,
          width: 46,
          height: 46,
        }}>
        <SearchIcon source={isEmpty ? searchIcon : closeIcon} />
      </Pressable>
    </View>
  );
}
