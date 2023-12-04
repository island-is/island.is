import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components/native'
import { font } from '../../utils/font'
import { Skeleton } from '../skeleton/skeleton'

const Host = styled.View<{ compact?: boolean }>`
  ${(props: any) => (props.compact ? 'width: 50%;' : 'flex: 1;')}
`

const Content = styled.View`
  padding-bottom: 20px;
`

const Label = styled.Text`
  ${font({
    fontSize: 13,
    lineHeight: 17,
  })}

  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Value = styled.Text<{ size?: 'large' | 'small' }>`
  ${font({
    fontWeight: '600',
    fontSize: (props) => (props.size === 'large' ? 20 : 16),
  })}
`

interface FieldProps {
  label?: string | null
  value?: string | null
  loading?: boolean
  compact?: boolean
  size?: 'large' | 'small'
  style?: any | null
}

const isJSONDate = (str: string) =>
  str && !!str.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)

export function Field({
  label,
  value,
  loading,
  compact,
  size = 'small',
  style,
}: FieldProps) {
  const intl = useIntl()

  if (value === '') {
    return <></>
  }

  const val = String(value ?? '')
    .split(' ')
    .map((part) =>
      isJSONDate(part) ? intl.formatDate(Date.parse(part)) : part,
    )
    .join(' ')

  return (
    <Host compact={compact} style={style}>
      <Content>
        <Label>{label}</Label>
        {loading ? <Skeleton active /> : <Value size={size}>{val}</Value>}
      </Content>
    </Host>
  )
}
