import React from 'react';
import styled from "styled-components/native";

interface VisualizedPinCodeProps {
  code: string;
  minChars?: number;
  maxChars?: number;
}

const Host = styled.View`
  flex-direction: row;
`;

const Dot = styled.View<{ active: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin: 0px 8px;
  background-color: ${props => props.active ? props.theme.color.blue400 : props.theme.color.blue100};
`;

export function VisualizedPinCode({ code, minChars = 4, maxChars = 6 }: VisualizedPinCodeProps) {
  const charsCount = Math.max(minChars, Math.min(maxChars, code.length));

  return (
    <Host>
      {Array.from({ length: charsCount }).map((n, i) => (
        <Dot key={i} active={i < code.length} />
      ))}
    </Host>
  );
}
