import React from 'react'
import styled from 'styled-components/native';

const Host = styled.Text<{ isCenter?: boolean }>`
  padding: 20px 0;
  margin-bottom: 20px;

  font-size: 30px;
  font-weight: bold;
  text-align: ${(props: any) => props.isCenter ? 'center' : 'left'};
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
