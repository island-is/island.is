import React from 'react'
import styled from 'styled-components/native';

const Host = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.blue100};
  padding-bottom: 16px;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const Text = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 20px;
  line-height: 26px;
  color: ${props => props.theme.shade.foreground};
`;

interface HeadingProps {
  children: React.ReactNode;
  isCenterAligned?: boolean;
}

export function Heading({ children, isCenterAligned }: HeadingProps) {
  return (
    <Host>
      <Text>
        {children}
      </Text>
    </Host>
  )
}
