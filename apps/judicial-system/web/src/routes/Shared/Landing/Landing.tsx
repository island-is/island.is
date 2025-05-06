import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import {
  CASES_ROUTE,
  COURT_OF_APPEAL_CASES_ROUTE,
  DEFENDER_CASES_ROUTE,
  PRISON_CASES_ROUTE,
  USERS_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isAdminUser,
  isCourtOfAppealsUser,
  isDefenceUser,
  isPrisonStaffUser,
} from '@island.is/judicial-system/types'
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
      const redirectRoute = isDefenceUser(user)
        ? DEFENDER_CASES_ROUTE
        : isPrisonStaffUser(user)
        ? PRISON_CASES_ROUTE
        : isCourtOfAppealsUser(user)
        ? COURT_OF_APPEAL_CASES_ROUTE
        : isAdminUser(user)
        ? USERS_ROUTE
        : CASES_ROUTE

      router.push(redirectRoute)
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
