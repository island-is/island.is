import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

const Host = styled.Text<{ isCenter?: boolean}>`
  padding: 20px 30px;
  margin-bottom: 50px;

  font-size: 30px;
  font-weight: bold;
  text-align: ${(props) => props.isCenter ? 'center' : 'left'};
`;

interface HeadingProps {
  children: React.ReactNode;
  isCenterAligned?: boolean;
}

export function Heading({ children, isCenterAligned }: HeadingProps) {
  return (
    <Host isCenter={isCenterAligned}>
      {children}
    </Host>
  )
}
