import React from 'react'
import { Text, Icon } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './AdminSideNavItems.css'

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
    <button
      className={`${styles.sideNavBarButton} navBarButtonHover`}
      onClick={() => router.push(Routes.users)}
    >
      <Icon
        icon="people"
        type="outline"
        color="blue400"
        className={styles.sideNavBarButtonIcon}
      />
      <Text> Notendur</Text>
    </button>
  )
}

export default AdminSideNavItems
