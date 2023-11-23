import React from 'react'
import { useLocale } from '@island.is/localization'
import { UserDropdownItem } from './UserDropdownItem'
import { userMessages } from '@island.is/shared/translations'
import { ProjectBasePath } from '@island.is/shared/constants'

interface UserProfileInfoProps {
  onClick: () => void
}

export const UserProfileInfo = ({ onClick }: UserProfileInfoProps) => {
  const { formatMessage } = useLocale()
  const origin = window.location.origin
  const baseUrl = `${origin}${ProjectBasePath.ServicePortal}/stillingar`

  return (
    <UserDropdownItem
      text={formatMessage(userMessages.personalInformation)}
      link={`${baseUrl}/minar-stillingar`}
      icon={{ type: 'outline', icon: 'settings' }}
      onClick={() => onClick()}
    />
  )
}
