import React, { useContext, useMemo } from 'react'
import {
  Text,
  Box,
  BulletList,
  Bullet,
  Button,
} from '@island.is/island-ui/core'

import {
  Approved,
  ContentContainer,
  Footer,
  InProgress,
  Rejected,
  StatusLayout,
  Timeline,
} from '@island.is/financial-aid-web/osk/src/components'

import { getActiveTypeForStatus } from '@island.is/financial-aid/shared'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/useLogOut'

const MainPage = () => {
  const { user } = useContext(UserContext)
  const logOut = useLogOut()

  const currentApplication = useMemo(() => {
    if (user?.currentApplication) {
      return user.currentApplication
    }
  }, [user])

  return (
    <StatusLayout>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Aðstoðin þín
        </Text>

        {currentApplication && (
          <>
            {getActiveTypeForStatus[currentApplication.state] ===
              'InProgress' && (
              <InProgress currentApplication={currentApplication} />
            )}

            {getActiveTypeForStatus[currentApplication.state] ===
              'Approved' && <Approved state={currentApplication.state} />}

            {getActiveTypeForStatus[currentApplication.state] ===
              'Rejected' && <Rejected state={currentApplication.state} />}

            <Timeline state={currentApplication.state} />
          </>
        )}

        <Text as="h4" variant="h3" marginBottom={2} marginTop={[3, 3, 7]}>
          Frekari aðgerðir í boði
        </Text>
        <Box marginBottom={[5, 5, 10]}>
          <BulletList type={'ul'} space={2}>
            <Bullet>
              <Button
                colorScheme="default"
                iconType="filled"
                onClick={() => {
                  /*TODO on click event */
                }}
                preTextIconType="filled"
                size="default"
                type="button"
                variant="text"
              >
                Upplýsingar um fjárhagsaðstoð
              </Button>
            </Bullet>
            <Bullet>
              <Button
                colorScheme="default"
                iconType="filled"
                onClick={() => {
                  /*TODO on click event */
                }}
                preTextIconType="filled"
                size="default"
                type="button"
                variant="text"
              >
                Hafa samband
              </Button>
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
    </StatusLayout>
  )
}

export default MainPage
