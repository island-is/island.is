import React from 'react'
import { Text } from '@island.is/island-ui/core'

import { ContentContainer } from '@island.is/financial-aid-web/osk/src/components'

import { ServiceCenter as IServiceCenter } from '@island.is/financial-aid/shared/data'

interface Props {
  serviceCenter?: IServiceCenter
}

const ServiceCenter = ({ serviceCenter }: Props) => {
  return (
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
          Athugaðu að {serviceCenter?.name} er ekki orðið hluti af lausnin núna
        </Text>
      )}
    </ContentContainer>
  )
}

export default ServiceCenter
