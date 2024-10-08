import Clipboard from '@react-native-clipboard/clipboard'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import CopyIcon from '../../assets/icons/copy.png'
import { dynamicColor } from '../../utils'
import { Skeleton } from '../skeleton/skeleton'
import { Typography } from '../typography/typography'
const Host = styled.SafeAreaView<{
  noBorder: boolean
  blueberryBorder?: boolean
  background?: boolean
}>`
  flex: 1;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(
    ({ theme, noBorder, blueberryBorder }) => ({
      light: noBorder
        ? 'transparent'
        : blueberryBorder
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

const Label = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

interface InputProps {
  label: string
  value?: string | null
  loading?: boolean
  error?: boolean
  valueTestID?: string
  noBorder?: boolean
  size?: 'normal' | 'big'
  isCompact?: boolean
  blueberryBorder?: boolean
  copy?: boolean
}

export function Input({
  label,
  value,
  loading,
  error,
  valueTestID,
  noBorder = false,
  size = 'normal',
  isCompact = false,
  blueberryBorder = false,
  copy = false,
}: InputProps) {
  const tvalue =
    value !== undefined && typeof value === 'string' && value.trim()

  return (
    <Host noBorder={noBorder} blueberryBorder={blueberryBorder}>
      <Content isCompact={isCompact}>
        <Label variant="body3">{label}</Label>
        {loading || error ? (
          <Skeleton
            active={loading}
            error={error}
            height={size === 'big' ? 26 : undefined}
          />
        ) : (
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
      </Content>
    </Host>
  )
}
