import React from 'react'
import styled from 'styled-components/native'
import { font } from '../../utils/font'
import { Skeleton } from '../skeleton/skeleton'
import { FormattedDate } from 'react-intl'

const Host = styled.View<{ compact?: boolean }>`
  ${(props: any) => (props.compact ? '' : 'flex: 1;')}
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
  const d = value && new Date(value)
  const isDate = value && d instanceof Date && !isNaN(d as any)

  return (
    <Host compact={compact} style={style}>
      <Content>
        <Label>{label}</Label>
        {loading ? (
          <Skeleton active />
        ) : (
          <Value size={size}>
            {isDate ? <FormattedDate value={d} /> : value ?? ''}
          </Value>
        )}
      </Content>
    </Host>
  )
}
