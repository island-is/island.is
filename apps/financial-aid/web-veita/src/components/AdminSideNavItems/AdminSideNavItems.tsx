import React from 'react'
import { Text, Icon } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as sideNavButtonStyles from '../../sharedStyles/SideNavButton.css'

import { Routes, StaffRole } from '@island.is/financial-aid/shared/lib'

interface Props {
  roles?: StaffRole[]
}

const AdminSideNavItems = ({ roles }: Props) => {
  const router = useRouter()

  if (roles === undefined || roles.includes(StaffRole.ADMIN) === false) {
    return null
  }

  return (
    <>
      <button
        className={`${sideNavButtonStyles.sideNavBarButton} navBarButtonHover`}
        onClick={() => router.push(Routes.settings.users)}
      >
        <Icon
          icon="people"
          type="outline"
          color="blue400"
          className={sideNavButtonStyles.sideNavBarButtonIcon}
        />
        <Text> Notendur</Text>
      </button>
      <button
        className={`${sideNavButtonStyles.sideNavBarButton} navBarButtonHover`}
        onClick={() => router.push(Routes.settings.municipality)}
      >
        <Icon
          icon="settings"
          type="outline"
          color="blue400"
          className={sideNavButtonStyles.sideNavBarButtonIcon}
        />
        <Text> Sveitarfélagsstillingar</Text>
      </button>
    </>
  )
}

export default AdminSideNavItems
