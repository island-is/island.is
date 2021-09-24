import React from 'react'
import { Text } from '@island.is/island-ui/core'

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
          Fjárhagsaðstoð Hafnarfjarðar
        </Text>

        <Text marginBottom={[1, 1, 2]}>
          Athugaðu að á þessum tímapunkti er þessi umsókn um fjárhagsaðstoð
          eingöngu ætluð íbúum Hafnarfjarðar.
        </Text>

        {serviceCenter && (
          <Text>
            {' '}
            Athugaðu að {serviceCenter?.name} er ekki orðið hluti af lausnin
            núna
          </Text>
        )}
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
