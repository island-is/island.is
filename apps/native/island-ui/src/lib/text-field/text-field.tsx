import React, { useRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import styled from "styled-components/native";
import { font } from "../../utils";


const Host = styled.Pressable`
  border: ${(props) => `1px solid ${props.theme.color.blue200}`};
  padding: ${({ theme }) => theme.spacing[1]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  background-color: ${(props) => props.theme.color.blue100};
`;

const Label = styled.Text`
  ${font({
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  })}

  color: ${(props) => props.theme.color.blue400};
  margin-bottom: 4px;
`;

const Input = styled.TextInput`
  padding-left: ${({ theme }) => theme.spacing[1]}px;
  ${font({
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  })}
`;

type TIProps = Omit<TextInputProps, 'onChange'>;

interface TextFieldProps extends TIProps {
  label: string;
  value: string;
  onChange: (e: string) => void;
}

export const TextField = ({ label, onChange, value, style, ...rest }: TextFieldProps) => {
  const inputRef = useRef<TextInput>(null)

  return (
    <Host onPress={() => inputRef.current?.focus()} style={style}>
      <Label>{label}</Label>
      <Input
        onChangeText={onChange}
        value={value}
        ref={inputRef}
        {...rest}
      />
    </Host>
  );
};
