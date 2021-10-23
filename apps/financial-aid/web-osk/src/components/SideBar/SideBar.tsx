import React, { useContext } from 'react'
import { Box, Text } from '@island.is/island-ui/core'

import { Stepper } from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'

import * as styles from './SideBar.treat'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const SideBar = () => {
  const router = useRouter()

  const { user, municipality } = useContext(AppContext)

  return (
    <>
      {user?.currentApplication || router.route.includes('/stada') ? (
        <Box className={styles.sidebarContent}>
          <Text as="h3" variant="h3" marginBottom={[1, 1, 2]}>
            Umsókn um fjárhagsaðstoð{' '}
            {municipality?.name ? `hjá ${municipality?.name}` : ''}
          </Text>
        </Box>
      ) : (
        <Stepper />
      )}
    </>
  )
}

export default SideBar
