
import React from 'react'
import styled from 'styled-components/native';
import { Skeleton } from '../Skeleton/Skeleton';

const Host = styled.View<{ compact?: boolean }>`
  ${(props) => (props.compact ? '' : 'flex: 1;')}
`

const Content = styled.View`
  padding-bottom: 20px;
`

const Label = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
  margin-bottom: 8px;
`

const Value = styled.Text<{ size?: 'large' | 'small' }>`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: ${(props) => (props.size === 'large' ? 20 : 16)}px;
  line-height: ${(props) => (props.size === 'large' ? 26 : 20)}px;
  color: ${(props) => props.theme.shade.foreground};
`

interface FieldProps {
  label: string
  value?: string
  loading?: boolean
  compact?: boolean
  size?: 'large' | 'small'
  style?: any
}

export function Field({
  label,
  value,
  loading,
  compact,
  size = 'small',
  style,
}: FieldProps) {
  return (
    <Host compact={compact} style={style}>
      <Content>
        <Label>{label}</Label>
        {loading ? (
          <Skeleton active />
        ) : (
          <Value size={size}>{value ?? ''}</Value>
        )}
      </Content>
    </Host>
  )
}
