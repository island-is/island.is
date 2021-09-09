import React, { useEffect } from 'react'
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
} from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const Confirmation = () => {
  const router = useRouter()

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const nextSteps = [
    'Fjölskylduþjónusta Hafnarfjarðar vinnur úr umsókninni. Afgreiðsla umsóknarinnar tekur 1–3 virka daga.',
    'Staðfesting verður send á þig í tölvupósti',
    'Ef þörf er á frekari upplýsingum eða gögnum mun fjölskylduþjónusta Hafnarfjarðar hafa samband.',
  ]

  const otherOptions = [
    {
      text: 'Upplýsingar um fjárhagsaðstoð',
      url: '/',
    },
    {
      text: 'Hafðu samband',
      url: '/',
    },
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
          <BulletList type={'ul'} space={2}>
            {otherOptions.map((item, index) => {
              return (
                <Bullet key={'options-' + index}>
                  <Button
                    colorScheme="default"
                    iconType="filled"
                    onClick={() => router.push(item.url)}
                    preTextIconType="filled"
                    size="default"
                    type="button"
                    variant="text"
                  >
                    {item.text}
                  </Button>
                </Bullet>
              )
            })}
          </BulletList>
        </Box>
      </ContentContainer>
    </FormLayout>
  )
}

export default Confirmation
