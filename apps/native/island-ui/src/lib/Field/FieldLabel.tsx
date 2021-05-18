import React from 'react'
import styled from 'styled-components/native';

const Host = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
  margin-bottom: 8px;
`;

interface FieldLabelProps {
  children: React.ReactNode;
}

export function FieldLabel({ children }: FieldLabelProps) {
  return (
    <Host>
      {children}
    </Host>
  )
}
