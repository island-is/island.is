import React, { useContext, useMemo } from 'react'
import {
  Text,
  Box,
  BulletList,
  Bullet,
  LoadingDots,
  Link,
} from '@island.is/island-ui/core'

import {
  Approved,
  ContentContainer,
  Footer,
  InProgress,
  Rejected,
  Timeline,
} from '@island.is/financial-aid-web/osk/src/components'

import {
  getActiveTypeForStatus,
  getCommentFromLatestEvent,
} from '@island.is/financial-aid/shared/lib'

import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/useLogOut'

import { ApplicationContext } from '@island.is/financial-aid-web/osk/src/components/ApplicationProvider/ApplicationProvider'

const MainPage = () => {
  const logOut = useLogOut()

  const { myApplication, loading, fetchError } = useContext(ApplicationContext)

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Aðstoðin þín
        </Text>

        {myApplication && myApplication?.state && (
          <>
            {getActiveTypeForStatus[myApplication.state] === 'InProgress' && (
              <InProgress currentApplication={myApplication} />
            )}

            <Approved
              state={myApplication.state}
              amount={myApplication.amount}
            />

            <Rejected
              state={myApplication.state}
              rejectionComment={myApplication?.rejection}
            />

            <Timeline
              state={myApplication.state}
              created={myApplication.created}
            />
          </>
        )}
        {fetchError && (
          <Text>
            Umsókn ekki fundin eða einhvað fór úrskeiðis <br />
            vinsamlegast reyndu síðar
          </Text>
        )}
        {loading && <LoadingDots />}

        <Text as="h4" variant="h3" marginBottom={2} marginTop={[3, 3, 7]}>
          Frekari aðgerðir í boði
        </Text>
        <Box marginBottom={[5, 5, 10]}>
          <BulletList type={'ul'} space={2}>
            <Bullet>
              <Link
                href="https://www.hafnarfjordur.is/ibuar/felagsleg-adstod/fjarhagsadstod/"
                color="blue400"
                underline="normal"
                underlineVisibility="always"
              >
                {/* TODO: different for muncipality */}
                <b>Upplýsingar um fjárhagsaðstoð</b>
              </Link>
            </Bullet>
            <Bullet>
              <Link
                href="mailto: felagsthjonusta@hafnarfjordur.is"
                color="blue400"
                underline="normal"
                underlineVisibility="always"
              >
                {/* TODO: different for muncipality */}
                <b> Hafa samband</b>
              </Link>
            </Bullet>
          </BulletList>
        </Box>
      </ContentContainer>
      <Footer
        onPrevButtonClick={() => {
          logOut()
        }}
        prevButtonText="Skrá sig út"
        previousIsDestructive={true}
        hideNextButton={true}
      />
    </>
  )
}

export default MainPage
