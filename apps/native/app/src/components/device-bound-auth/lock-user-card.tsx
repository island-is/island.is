import React from 'react'
import { useIntl } from 'react-intl'
import Svg, { Path } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { formatNationalId } from '@/lib/format-national-id'
import { Avatar, dynamicColor, Typography } from '@/ui'

const Host = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  padding-left: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
`

const Content = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing[2]}px;
`

const LogoutButton = styled.TouchableOpacity`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-vertical: ${({ theme }) => theme.spacing[1]}px;
`

// Ionicons log-out-outline, the island.is design system's logout icon.
function LogoutIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 512 512">
      <Path
        d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40M368 336l80-80-80-80M176 256h256"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </Svg>
  )
}

interface LockUserCardProps {
  name: string
  nationalId: string
  onLogoutPress(): void
}

/**
 * Whose app this is, on the lock screen, with a way out for someone else to
 * log in instead.
 */
export function LockUserCard({
  name,
  nationalId,
  onLogoutPress,
}: LockUserCardProps) {
  const intl = useIntl()
  const theme = useTheme()

  return (
    <Host>
      <Avatar name={name} isSmall />
      <Content>
        <Typography variant="heading5">{name}</Typography>
        <Typography variant="body3">{formatNationalId(nationalId)}</Typography>
      </Content>
      <LogoutButton
        onPress={onLogoutPress}
        accessibilityRole="button"
        accessibilityLabel={intl.formatMessage({ id: 'applock.logout' })}
      >
        <LogoutIcon color={theme.color.blue400} />
      </LogoutButton>
    </Host>
  )
}
