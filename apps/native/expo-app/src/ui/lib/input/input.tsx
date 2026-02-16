import Clipboard from '@react-native-clipboard/clipboard'
import React from 'react'
import { Image, TouchableOpacity, View, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Label } from '../label/label'
import CopyIcon from '../../assets/icons/copy.png'
import { dynamicColor } from '../../utils'
import { Skeleton } from '../skeleton/skeleton'
import { Typography } from '../typography/typography'

const Host = styled.SafeAreaView<{
  noBorder: boolean
  darkBorder?: boolean
  background?: boolean
}>`
  flex: 1;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(
    ({ theme, noBorder, darkBorder }) => ({
      light: noBorder
        ? 'transparent'
        : darkBorder
        ? theme.color.blueberry200
        : theme.color.blue200,
      dark: noBorder ? 'transparent' : theme.shades.dark.shade200,
    }),
    true,
  )};
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
`

const Content = styled.View<{ isCompact: boolean }>`
  padding-top: ${({ theme, isCompact }) => theme.spacing[isCompact ? 1 : 3]}px;
  padding-bottom: ${({ theme, isCompact }) =>
    theme.spacing[isCompact ? 1 : 3]}px;
`

const LabelText = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const WarningMessage = styled.View`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  flex-direction: row;
`

interface InputProps {
  label: string
  value?: string | null
  loading?: boolean
  loadLabel?: boolean
  error?: boolean
  valueTestID?: string
  noBorder?: boolean
  size?: 'normal' | 'big'
  isCompact?: boolean
  darkBorder?: boolean
  copy?: boolean
  warningText?: string
  rightElement?: React.ReactNode
  allowEmptyValue?: boolean
  fullWidthWarning?: boolean
  style?: ViewStyle
}

export function Input({
  label,
  value,
  loading,
  error,
  valueTestID,
  loadLabel = false,
  noBorder = false,
  size = 'normal',
  isCompact = false,
  darkBorder = false,
  copy = false,
  warningText = '',
  rightElement,
  allowEmptyValue = false,
  fullWidthWarning = false,
  style,
}: InputProps) {
  const theme = useTheme()
  const tvalue =
    value !== undefined && typeof value === 'string' && value.trim()

  return (
    <Host noBorder={noBorder} darkBorder={darkBorder}>
      <Content isCompact={isCompact}>
        <View
          style={[
            style,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}
        >
          <View style={{ flex: 1, marginRight: theme.spacing[2] }}>
            {loadLabel && loading ? (
              <Skeleton
                active={loading}
                error={error}
                style={{ marginBottom: theme.spacing[1], width: '50%' }}
              />
            ) : (
              <LabelText variant="body3">{label}</LabelText>
            )}
            {loading || error ? (
              <Skeleton
                active={loading}
                error={error}
                height={size === 'big' ? 26 : undefined}
              />
            ) : allowEmptyValue && value === '' ? null : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Typography
                  testID={valueTestID}
                  selectable
                  variant={size === 'normal' ? 'heading5' : 'heading3'}
                >
                  {tvalue === '' || !value ? '-' : value}
                </Typography>
                {copy && (
                  <TouchableOpacity
                    onPress={() => Clipboard.setString(value ?? '')}
                    style={{ marginLeft: 4 }}
                  >
                    <Image
                      source={CopyIcon}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          {rightElement}
        </View>
        {!loading && !error && warningText && (
          <WarningMessage>
            <Label color="warning" icon fullWidth={fullWidthWarning}>
              {warningText}
            </Label>
          </WarningMessage>
        )}
      </Content>
    </Host>
  )
}
