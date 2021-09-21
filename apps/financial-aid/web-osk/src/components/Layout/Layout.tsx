import React, { ReactNode, useContext, useEffect } from 'react'
import { Box, GridContainer } from '@island.is/island-ui/core'

import * as styles from './Layout.treat'

import {
  Login,
  HasApplied,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import cn from 'classnames'
interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  const { isAuthenticated, user } = useContext(UserContext)

  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  if (!isAuthenticated) {
    return <Login headline="Skráðu þig inn" />
  }
  if (!user) {
    return null
  }

  return (
    <Box
      paddingY={[3, 3, 3, 6]}
      background="purple100"
      className={styles.processContainer}
    >
      <GridContainer
        className={cn({
          [`${styles.gridContainer}`]: !user.currentApplication,
        })}
      >
        {user.currentApplication ? (
          <HasApplied />
        ) : (
          <FormLayout>{children}</FormLayout>
        )}
      </GridContainer>
    </Box>
  )
}

export default Layout
