import React from 'react'
import styled from 'styled-components/native';
import { theme, Colors } from '@island.is/island-ui/theme';

const Host = styled.View<{ backgroundColor: Colors; borderColor: Colors; }>`
  padding: 16px 16px;
  background-color: ${(props) => theme.color[props.backgroundColor]};

  border-width: ${theme.border.width.standard}px;
  border-style: ${theme.border.style.solid};
  border-color: ${(props) => theme.color[props.borderColor]};
  border-radius: ${theme.border.radius.standard};
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: ${theme.typography.semiBold};
  color: ${theme.color.dark400};
  line-height: 24px;
`;

const Description = styled.Text`
  margin-top: 15px;
  font-size: 12px;
  color: ${theme.color.dark400};
  line-height: 18px;
`;

export type AlertType = 'error' | 'info' | 'success' | 'warning'

type VariantStyle = {
  background: Colors
  borderColor: Colors
}

type VariantStyles = {
  [Type in AlertType]: VariantStyle
}

const variantStyles: VariantStyles = {
  error: {
    background: 'red100',
    borderColor: 'red200',
  },
  info: {
    background: 'blue100',
    borderColor: 'blue200',
  },
  success: {
    background: 'mint100',
    borderColor: 'mint200',
  },
  warning: {
    background: 'yellow200',
    borderColor: 'yellow400',
  },
}

interface AlertProps {
  type: AlertType,
  title: string,
  message?: string,
}

export function Alert({ title, message, type }: AlertProps) {
  const variant = variantStyles[type];
  return (
    <Host backgroundColor={variant.background} borderColor={variant.borderColor}>
      <Title>{title}</Title>
      {message && (
        <Description>{message}</Description>
      )}
    </Host>
  )
}
