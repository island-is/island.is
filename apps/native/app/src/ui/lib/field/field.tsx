import React from 'react'
import { useIntl } from 'react-intl'
import { Image, TouchableOpacity, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import Clipboard from 'expo-clipboard'

import { Skeleton } from '../skeleton/skeleton'
import { Typography } from '../typography/typography'
import {
  GenericUserLicenseMetaLinks,
  GenericUserLicenseMetaLinksType,
} from '../../../graphql/types/schema'
import copyIcon from '../../../ui/assets/icons/copy.png'

const Host = styled.View<{ compact?: boolean }>`
  ${(props) => (props.compact ? 'width: 50%;' : 'flex: 1;')}
`

const Content = styled.View`
  padding-bottom: ${({ theme }) => theme.spacing[3]}px;
`

const Label = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Value = styled(Typography)``

const ValueWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`

interface FieldProps {
  label?: string | null
  value?: string | null
  link?: GenericUserLicenseMetaLinks | null
  loading?: boolean
  compact?: boolean
  size?: 'large' | 'small'
  style?: ViewStyle | null
}

const isJSONDate = (str: string) =>
  str && !!str.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)

export function Field({
  label,
  value,
  loading,
  link,
  compact,
  size = 'small',
  style,
}: FieldProps) {
  const intl = useIntl()

  if (value === '') {
    return null
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
        <Label variant={'body3'}>{label}</Label>
        <ValueWrapper>
          {loading ? (
            <Skeleton active />
          ) : (
            <Value variant={size === 'large' ? 'heading4' : 'heading5'}>
              {val}
            </Value>
          )}
          {link?.type === GenericUserLicenseMetaLinksType.Copy && (
            <TouchableOpacity
              onPress={() => Clipboard.setStringAsync(value ?? '')}
              style={{ marginLeft: 4 }}
            >
              <Image
                source={copyIcon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </ValueWrapper>
      </Content>
    </Host>
  )
}
