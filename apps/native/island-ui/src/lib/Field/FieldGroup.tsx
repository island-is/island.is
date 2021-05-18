
import React from 'react'
import styled from 'styled-components/native';

const Host = styled.View`
  width: 100%;
  margin-top: 24px;
  padding-bottom: 4px;
  border-bottom-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade500
      : props.theme.color.blue200};
  border-bottom-width: 1px;
`;

interface FieldGroupProps {
  children: React.ReactNode;
}

export function FieldGroup({ children }: FieldGroupProps) {
  return (
    <Host>
      {children}
    </Host>
  )
}
