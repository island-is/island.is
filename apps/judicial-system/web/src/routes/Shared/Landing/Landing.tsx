import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { getUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  PageHeader,
  UserContext,
} from '@island.is/judicial-system-web/src/components'

import Login from './Login/Login'
import SelectUser from './SelectUser/SelectUser'
import * as styles from './Landing.css'

const Landing = () => {
  const router = useRouter()
  const { user, eligibleUsers } = useContext(UserContext)

  useEffect(() => {
    if (user && eligibleUsers && eligibleUsers.length === 1) {
      router.push(getUserDashboardRoute(user))
    }
  }, [eligibleUsers, router, user])

  return (
    <>
      <PageHeader title="Réttarvörslugátt" />
      <Box
        paddingY={[0, 0, 3, 6]}
        paddingX={[0, 0, 4]}
        background="purple100"
        className={styles.landingContainer}
      >
        <GridContainer className={styles.container}>
          <GridRow direction={['columnReverse', 'columnReverse', 'row']}>
            <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
              <Box
                background="white"
                borderColor="white"
                paddingTop={[3, 3, 10, 10]}
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                className={styles.processContent}
              >
                {eligibleUsers && eligibleUsers.length > 1 ? (
                  <SelectUser />
                ) : (
                  <Login />
                )}
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

export default Landing
