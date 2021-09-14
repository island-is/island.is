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
  FormLayout,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { NavigationProps, Routes } from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/useLogOut'

const Confirmation = () => {
  const router = useRouter()
  const { form } = useContext(FormContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const logOut = useLogOut()

  const nextSteps = [
    'Fjölskylduþjónusta Hafnarfjarðar vinnur úr umsókninni. Afgreiðsla umsóknarinnar tekur 1–3 virka daga.',
    'Staðfesting verður send á þig í tölvupósti',
    'Ef þörf er á frekari upplýsingum eða gögnum mun fjölskylduþjónusta Hafnarfjarðar hafa samband.',
  ]

  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  return (
    <FormLayout activeSection={navigation?.activeSectionIndex}>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
          Staðfesting
        </Text>

        <Box marginBottom={[4, 4, 5]}>
          <AlertMessage
            type="success"
            title="Umsókn þín um fjárhagsaðstoð hjá Hafnarfirði er móttekin"
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
          {form.applicationId && (
            <Box marginBottom={3}>
              <Button
                icon="open"
                colorScheme="default"
                iconType="outline"
                onClick={() =>
                  router.push(Routes.statusPage(form?.applicationId as string))
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

          <Box marginBottom={3}>
            <Button
              icon="open"
              colorScheme="default"
              iconType="outline"
              preTextIconType="filled"
              size="small"
              onClick={() => {
                // TODO when there more muncipality
                window.open(
                  'https://www.hafnarfjordur.is/ibuar/felagsleg-adstod/fjarhagsadstod/"',
                  '_ blank',
                )
              }}
              type="button"
              variant="text"
            >
              Upplýsingar um fjárhagsaðstoð
            </Button>
          </Box>
        </Box>
      </ContentContainer>
      <Footer
        hidePreviousButton={true}
        nextButtonText={'Loka'}
        nextButtonIcon={'close'}
        onNextButtonClick={() => logOut()}
      />
    </FormLayout>
  )
}

export default Confirmation
