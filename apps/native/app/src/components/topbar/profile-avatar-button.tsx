import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Avatar } from '../../ui'
import { useAuthStore } from '../../stores/auth-store'

const Host = styled(View)`
  padding: ${({ theme }) => theme.spacing[1]}px;
`

interface ProfileAvatarButtonProps {
  onPress?: () => void
}

export const ProfileAvatarButton = ({ onPress }: ProfileAvatarButtonProps) => {
  const theme = useTheme()
  const userInfo = useAuthStore((s) => s.userInfo)

  const initialsName = useMemo(() => userInfo?.name ?? '', [userInfo?.name])

  return (
    <Host>
      {onPress ? (
        <TouchableOpacity
          accessibilityLabel="Profile avatar"
          onPress={onPress}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View
            style={{
              width: theme.spacing[1],
              height: theme.spacing[1],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Avatar name={initialsName} size="small" />
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            width: theme.spacing[1],
            height: theme.spacing[1],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar name={initialsName} size="small" />
        </View>
      )}
    </Host>
  )
}
