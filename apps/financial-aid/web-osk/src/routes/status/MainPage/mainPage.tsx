import React, { useContext, useEffect } from 'react'
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

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/hooks/useLogOut'

import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const MainPage = () => {
  const logOut = useLogOut()

  const {
    myApplication,
    loading,
    error,
    municipality,
    setMunicipality,
    user,
  } = useContext(AppContext)

  const isUserSpouse = user?.isSpouse?.hasApplied

  useEffect(() => {
    if (myApplication && myApplication.municipalityCode) {
      setMunicipality(myApplication.municipalityCode)
    }
  }, [myApplication])

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={1}>
          {isUserSpouse ? 'Aðstoð maka þíns' : 'Aðstoðin þín '}
        </Text>

        {myApplication && myApplication?.state && (
          <>
            <InProgress
              application={myApplication}
              isApplicant={!user?.isSpouse?.hasApplied}
            />

            <Approved
              isStateVisible={myApplication.state === ApplicationState.APPROVED}
              state={myApplication.state}
              amount={myApplication.amount}
              isApplicant={!isUserSpouse}
            />

            <Rejected
              isStateVisible={myApplication.state === ApplicationState.REJECTED}
              state={myApplication.state}
              rejectionComment={myApplication?.rejection}
              isApplicant={!isUserSpouse}
            />

            <Timeline
              state={myApplication.state}
              created={myApplication.created}
            />
          </>
        )}

        {error && (
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
                href={municipality?.homepage ?? ''}
                color="blue400"
                underline="normal"
                underlineVisibility="always"
              >
                <b>Upplýsingar um fjárhagsaðstoð</b>
              </Link>
            </Bullet>
            <Bullet>
              <Link
                href={`mailto: ${municipality?.email}`}
                color="blue400"
                underline="normal"
                underlineVisibility="always"
              >
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
