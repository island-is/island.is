import React from 'react'
import { useLocale } from '@island.is/localization'
import { UserDropdownItem } from './UserDropdownItem'
import { userMessages } from '@island.is/shared/translations'

interface UserProfileInfoProps {
  onClick: () => void
}

export const UserProfileInfo = ({ onClick }: UserProfileInfoProps) => {
  const { formatMessage } = useLocale()
  const origin = window.location.origin
  const baseUrl = `${origin}/minarsidur/stillingar`

  return (
    <UserDropdownItem
      text={formatMessage(userMessages.personalInformation)}
      link={`${baseUrl}/minar-stillingar`}
      icon={{ type: 'outline', icon: 'settings' }}
      onClick={() => onClick()}
    />
  )
}
