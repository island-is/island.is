import React from 'react';
import styled from 'styled-components/native';
import {font} from '../../utils';

const Host = styled.Text`
  ${font({
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '300',
  })}
`;

interface TypographyProps {
  children: React.ReactNode;
}

export const Typography = ({children}: TypographyProps) => {
  return <Host>{children}</Host>;
};
