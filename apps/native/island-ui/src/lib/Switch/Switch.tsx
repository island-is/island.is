import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';
import { SwitchProps } from 'react-native';

const Host = styled.Switch`
`;

interface SwitchLabelProps extends SwitchProps {
  onValueChange: () => void;
  isEnabled: boolean;
}

export function Switch({ onValueChange, isEnabled, ...rest }: SwitchLabelProps) {
  return (
    <Host
      trackColor={{ false: theme.color.dark100, true: theme.color.blue400 }}
      thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onValueChange}
      value={isEnabled}
      {...rest}
    />
  )
}
