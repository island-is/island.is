import React, { useRef } from 'react';
import styled from "styled-components/native"
import { TextInputProps, TouchableOpacity } from 'react-native';
import searchIcon from '../../assets/icons/search.png';
import closeIcon from '../../assets/icons/close.png';
import { useState } from 'react';
import { TextInput } from 'react-native';

const Host = styled.View`
  flex-direction: row;
`;

const SearchIcon = styled.Image`
  position: absolute;
  right: 10px;
  top: 7px;
  width: 24px;
  height: 24px;
`;

const Input = styled.TextInput`
  flex: 1;
  background-color: ${props => props.theme.color.blue100};
  border-color: ${props => props.theme.color.blue200};
  border-width: 1px;
  border-radius: 8px;
  padding: 8px 16px;

  font-family: 'IBMPlexSans';
  font-size: 16px;
`;

interface SearchBarProps extends TextInputProps {
  onSearchPress?(): void;
  onCancelPress?(): void;
}

export function SearchBar(props: SearchBarProps) {
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
    } else if (props.onSearchPress) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }

  return (
    <Host>
      <Input
        ref={inputRef}
        {...props as any}
        onFocus={(e) => {
          setFocus(true);
          return props?.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          return props?.onBlur?.(e);
        }}
      />
      <TouchableOpacity onPress={onRightIconPress}>
        <SearchIcon source={isEmpty ? searchIcon : closeIcon} />
      </TouchableOpacity>
    </Host>
  )
}
