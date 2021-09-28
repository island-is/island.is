import React from 'react'
import { Text, Button } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'

import { ServiceCenter as IServiceCenter } from '@island.is/financial-aid/shared/data'
import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/useLogOut'

interface Props {
  serviceCenter?: IServiceCenter
}

const ServiceCenter = ({ serviceCenter }: Props) => {
  const logOut = useLogOut()

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Fjárhagsaðstoð hjá þínu sveitarfélagi{' '}
        </Text>

        <Text marginBottom={[1, 1, 2]}>
          Samkvæmt <b>Þjóðskrá</b> ert þú með lögheimili í{' '}
          <b>{serviceCenter?.name}</b> .
        </Text>

        <Text marginBottom={[2, 2, 4]}>
          Þitt sveitarfélag er ekki komið inn í þetta umsóknarferli. Kynntu þér
          málið eða sæktu um fjárhagsaðstoð á heimasíðu þíns sveitarfélags eða
          þess sveitarfélags sem sér um fjárhagsaðstoð hjá þínu sveitarfélagi.
        </Text>

        <Button
          variant="ghost"
          icon="open"
          iconType="outline"
          onClick={() => {
            window.open(serviceCenter?.link, '_ blank')
          }}
        >
          Fjárhagsaðstoð {serviceCenter?.name}
        </Button>
      </ContentContainer>
      <Footer
        onPrevButtonClick={() => logOut()}
        previousIsDestructive={true}
        prevButtonText="Hætta við"
        hideNextButton={true}
      />
    </>
  )
}

export default ServiceCenter
