import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { UserDropdownItem } from './UserDropdownItem'
import { m } from '@island.is/service-portal/core'

interface UserProfileInfoProps {
  onClick: () => void
}

export const UserProfileInfo = ({ onClick }: UserProfileInfoProps) => {
  const { formatMessage } = useLocale()
  const origin = window.location.origin
  const baseUrl = `${origin}/minarsidur/stillingar`

  return (
    <UserDropdownItem
      text={formatMessage(m.personalInformation)}
      link={`${baseUrl}/minar-stillingar`}
      icon={{ type: 'outline', icon: 'settings' }}
      onClick={() => onClick()}
    />
  )
}
