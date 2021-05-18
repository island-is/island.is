import React from 'react'
import styled from 'styled-components/native';
import { Skeleton } from '../Skeleton/Skeleton';

const Host = styled.SafeAreaView`
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade200
      : props.theme.color.blue100};
  margin-left: 16px;
  margin-right: 16px;
`

const Content = styled.View`
  padding-top: 24px;
  padding-bottom: 24px;
`

const Label = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
  margin-bottom: 8px;
`

const Value = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.shade.foreground};
`

interface InputProps {
  label: string
  value?: string
  loading?: boolean
  error?: boolean
  valueTestID?: string
}

export function Input({
  label,
  value,
  loading,
  error,
  valueTestID
 }: InputProps) {
  return (
    <Host>
      <Content>
        <Label>{label}</Label>
        {loading || error ? (
          <Skeleton active={loading} error={error} />
        ) : (
          <Value testID={valueTestID}>{value ?? ''}</Value>
        )}
      </Content>
    </Host>
  )
}
