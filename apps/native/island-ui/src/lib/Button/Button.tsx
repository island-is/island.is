import React from 'react'
import { TouchableHighlightProps } from '../../../../../../node_modules/@types/react-native';
import styled, { useTheme } from 'styled-components/native';

// type TouchableHighlightProps = TouchableHighlightProps;

interface ButtonProps extends TouchableHighlightProps {
  title: string;
  isTransparent?: boolean;
}

type HostProps = Omit<ButtonProps, "title">;

const Host = styled.TouchableHighlight<HostProps>`
  padding: ${props => `${props.theme.spacing.p3}px ${props.theme.spacing.p4}px`};
  background-color: ${(props) => props.disabled ?
    props.theme.color.dark200 :
    props.isTransparent ?
    'transparent' :
    props.theme.color.blue400
  };
  border-radius: ${props => props.theme.border.radius.large};
  min-width: 192px;
`;

const Text = styled.Text<{ isTransparent?: boolean }>`
  color: ${(props) => props.isTransparent ? '#808080' : '#ffffff'} ;
  text-align: center;
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
`;

export function Button({ title, isTransparent, ...rest }: ButtonProps) {
  const theme = useTheme();
  return (
    <Host
      underlayColor={isTransparent ? theme.shade.shade100 : theme.color.blue600}
      isTransparent={isTransparent}
      {...rest}
    >
      <Text isTransparent={isTransparent}>{title}</Text>
    </Host>
  )
}
