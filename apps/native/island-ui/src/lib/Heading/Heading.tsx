import React from 'react'
import styled from 'styled-components/native';

const Host = styled.Text<{ isCenter?: boolean }>`
  padding: 20px 0;
  margin-bottom: 20px;

  font-family: 'IBMPlexSans-SemiBold';
  font-size: 27px;
  font-weight: bold;
  text-align: ${(props: any) => props.isCenter ? 'center' : 'left'};
  color: ${props => props.theme.shade.foreground};
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
