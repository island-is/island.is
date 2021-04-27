import React from 'react'
import { Text } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../components'

const EmailForm = () => {
  return (
    <FormLayout activeSection={1}>
      <FormContentContainer>
        <Text as="h1" variant="h1">
          Samskiptaupplýsingar
        </Text>
        <Text>
          Vinsamlegast staðfestu eða uppfærðu netfangið þitt svo öll samskipti
          milli þín og sveitarfélagsins gangi greiðlega fyrir sig í
          umsóknarferlinu.
        </Text>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter previousUrl="/umsokn" />
      </FormContentContainer>
    </FormLayout>
  )
}

export default EmailForm
