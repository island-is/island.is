import React from 'react';
import styled from 'styled-components/native';
import {font} from '../../utils/font';

const Host = styled.Text`
  ${font({
    fontWeight: '600',
    lineHeight: 20,
    fontSize: 16,
  })}
  color: ${props => props.theme.color.blue400};
`;

interface LinkTextProps {
  children: string;
}

export function LinkText({children}: LinkTextProps) {
  return <Host>{children}</Host>;
}
