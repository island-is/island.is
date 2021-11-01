import React, { useContext, useEffect } from 'react'
import {
  Text,
  Box,
  AlertMessage,
  BulletList,
  Bullet,
  Button,
} from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

import { getNextPeriod, Routes } from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/hooks/useLogOut'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const Confirmation = () => {
  const router = useRouter()
  const { form } = useContext(FormContext)
  const { municipality, user } = useContext(AppContext)

  const applicationId = form.applicationId || user?.currentApplication

  const logOut = useLogOut()

  const nextSteps = [
    'Vinnsluaðili sveitarfélagsins vinnur úr umsókninni. Umsóknin verður afgreidd eins fljótt og auðið er.',
    `Ef umsóknin er samþykkt getur þú reiknað með útgreiðslu í byrjun ${getNextPeriod.month}.`,
    'Ef þörf er á frekari upplýsingum eða gögnum til að vinna úr umsókninni mun vinnsluaðili sveitarfélagsins hafa samband.',
  ]

  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
          Staðfesting
        </Text>

        <Box marginBottom={[4, 4, 5]}>
          <AlertMessage
            type="success"
            title="Umsókn þín um fjárhagsaðstoð er móttekin"
          />
        </Box>

        <Text as="h2" variant="h3" marginBottom={2}>
          Hér eru næstu skref
        </Text>
        <Box marginBottom={[4, 4, 5]}>
          <BulletList type={'ul'} space={2}>
            {nextSteps.map((item, index) => {
              return <Bullet key={'nextSteps-' + index}>{item}</Bullet>
            })}
          </BulletList>
        </Box>

        <Text as="h2" variant="h3" marginBottom={2}>
          Frekari aðgerðir í boði
        </Text>
        <Box marginBottom={[4, 4, 5]}>
          {applicationId && (
            <Box marginBottom={3}>
              <Button
                icon="open"
                colorScheme="default"
                iconType="outline"
                onClick={() =>
                  router.push(Routes.statusPage(applicationId as string))
                }
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
              >
                Sjá stöðu umsóknar
              </Button>
            </Box>
          )}

          {municipality?.homepage && (
            <Box marginBottom={3}>
              <Button
                icon="open"
                colorScheme="default"
                iconType="outline"
                preTextIconType="filled"
                size="small"
                onClick={() => {
                  window.open(municipality.homepage, '_ blank')
                }}
                type="button"
                variant="text"
              >
                Upplýsingar um fjárhagsaðstoð
              </Button>
            </Box>
          )}
        </Box>
      </ContentContainer>
      <Footer
        hidePreviousButton={true}
        nextButtonText={'Loka'}
        nextButtonIcon={'close'}
        onNextButtonClick={() => logOut()}
      />
    </>
  )
}

export default Confirmation
