
import React from 'react'
import styled from 'styled-components/native';

const Host = styled.View`
  flex-direction: row;
`;

interface FieldRow {
  children: React.ReactNode;
}

export function FieldRow({ children }: FieldRow) {
  return (
    <Host>
      {children}
    </Host>
  )
}
