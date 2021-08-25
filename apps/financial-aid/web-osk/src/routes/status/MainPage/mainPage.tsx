import React, { useContext, useMemo } from 'react'
import {
  Text,
  ActionCard,
  Box,
  BulletList,
  Bullet,
  Button,
} from '@island.is/island-ui/core'

import {
  ContentContainer,
  Estimation,
  Footer,
  StatusLayout,
  Timeline,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

import * as styles from './mainPage.treat'

import {
  ApplicationState,
  getState,
  months,
} from '@island.is/financial-aid/shared'

import format from 'date-fns/format'
import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/useLogOut'

const MainPage = () => {
  const router = useRouter()

  const { user } = useContext(UserContext)
  const logOut = useLogOut()

  const currentApplication = useMemo(() => {
    if (user?.currentApplication) {
      return user.currentApplication
    }
  }, [user])

  const currentMonth = parseInt(format(new Date(), 'MM'))
  const currentYear = format(new Date(), 'yyyy')

  const pageType = (state: ApplicationState) => {
    switch (state) {
      case ApplicationState.NEW:
        return {
          phase: 1,
          applicationIs: 'móttekin',
        }
      case ApplicationState.INPROGRESS:
        return {
          phase: 1,
          applicationIs: 'í vinnslu',
        }
      case ApplicationState.APPROVED:
        return {
          phase: 2,
          applicationIs: 'samþykkt',
        }
      case ApplicationState.REJECTED:
        return {
          phase: 3,
          applicationIs: 'synjuð',
        }
      case ApplicationState.DATANEEDED:
        return {
          phase: 1,
          applicationIs: 'í vinnslu',
        }
    }
  }

  return (
    <StatusLayout>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Aðstoðin þín
        </Text>

        {currentApplication && (
          <>
            {pageType(currentApplication.state).phase === 1 && (
              <>
                <Text
                  as="h2"
                  variant="h3"
                  color="blue400"
                  marginBottom={[4, 4, 7]}
                >
                  Umsókn {pageType(currentApplication.state).applicationIs} til
                  útgreiðslu í {months[currentMonth].toLowerCase()} {` `}{' '}
                  {currentYear}
                </Text>

                {currentApplication.state === ApplicationState.DATANEEDED && (
                  <Box marginBottom={[4, 4, 7]}>
                    <ActionCard
                      heading="Vantar gögn"
                      text="Við þurfum að fá gögn frá þér áður en við getum haldið áfram með umsóknina."
                      cta={{
                        label: 'Hlaða upp gögnum',
                        onClick: () => {
                          router.push(`${router.query.id}/gogn`)
                        },
                      }}
                      backgroundColor="blue"
                    />
                  </Box>
                )}

                <Timeline state={currentApplication.state} />

                <Estimation
                  homeCircumstances={currentApplication.homeCircumstances}
                  usePersonalTaxCredit={
                    currentApplication?.usePersonalTaxCredit
                  }
                  aboutText={
                    <Text marginBottom={[2, 2, 3]}>
                      Athugaðu að þessi útreikningur er{' '}
                      <span className={styles.taxReturn}>
                        eingöngu til viðmiðunar og getur tekið breytingum.
                      </span>{' '}
                      Þú færð skilaboð þegar frekari útreikningur liggur fyrir.
                      Niðurstaða umsóknar þinnar ætti að liggja fyrir innan X
                      virkra daga.
                    </Text>
                  }
                />
              </>
            )}

            {pageType(currentApplication.state).phase === 2 && (
              <>
                <Text
                  as="h2"
                  variant="h3"
                  color="mint600"
                  marginBottom={[4, 4, 7]}
                >
                  Umsókn {pageType(currentApplication.state).applicationIs}
                </Text>

                <Text variant="intro">
                  Umsóknin þín um fjárhagsaðstoð í ágúst er samþykkt en athugaðu
                  að hún byggir á tekjum og öðrum þáttum sem kunna að koma upp í
                  ágúst og getur því tekið breytingum.
                </Text>
              </>
            )}

            {pageType(currentApplication.state).phase === 3 && (
              <>
                <Text
                  as="h2"
                  variant="h3"
                  color="red400"
                  marginBottom={[4, 4, 7]}
                >
                  Umsókn {pageType(currentApplication.state).applicationIs}
                </Text>

                <Text variant="intro">
                  Umsóknin þinni um fjárhagsaðstoð í maí hefur verið synjað á
                  grundvelli 12. gr.: Tekjur og eignir umsækjanda. Líttu yfir
                  greinina hér fyrir neðan og skráðu þig inn á stöðusíðuna og
                  sendu okkur athugasemd eða viðeigandi gögn ef þú telur að
                  niðurstaðan sé röng.
                </Text>
              </>
            )}
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
