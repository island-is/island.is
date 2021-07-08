import React from 'react'

import {
  Box,
  Text,
  ContentBlock,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CustomField, FieldBaseProps } from '@island.is/application/core'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

interface name {
  fullName: string
}

function Congratulations({
  error,
  field,
  application,
}: PropTypes): JSX.Element {
  const name = application.externalData.nationalRegistry?.data as name
  return (
    <Box paddingTop={2}>
      <Box marginTop={2}>
        <ContentBlock>
          <AlertMessage
            type="success"
            title={`Til hamingju ${name.fullName}`}
            message={`Umsókn þín um fullnaðarskírteini tókst.`}
          />
        </ContentBlock>

        <Box marginTop={6}>
          <Text>
            Ef beðið var um viðbótargögn (nýja ljósmynd eða læknisvottorð) þarf
            að skila þeim til Sýslumanns svo að fullnaðarskírteini fari í
            pöntun.
          </Text>
          <Text marginTop={4}>
            Ef svo var ekki þá verður fullnaðarskírteinið tilbúið á
            afhendingarstað eftir 3 til 4 vikur.
          </Text>
        </Box>

        <Box marginTop={6}>
          <img role="presentation" src="/assets/images/movingTruck.svg" />
        </Box>
      </Box>
    </Box>
  )
}

export default Congratulations
