import React, { useContext, useEffect } from 'react'
import { Box, Text } from '@island.is/island-ui/core'

import { Stepper } from '@island.is/financial-aid-web/osk/src/components'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

import { useRouter } from 'next/router'

import * as styles from './SideBar.treat'

const SideBar = () => {
  const router = useRouter()

  const { user } = useContext(UserContext)

  return (
    <>
      {user?.currentApplication || router.route.includes('/stada') ? (
        <Box className={styles.sidebarContent}>
          <Text as="h3" variant="h3" marginBottom={[1, 1, 2]}>
            Umsókn um fjárhagsaðstoð hjá Hafnarfjarðarbæ
          </Text>
        </Box>
      ) : (
        <Stepper />
      )}
    </>
  )
}

export default SideBar
