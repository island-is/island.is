import React, { useContext } from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  StatusLayout,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

const Info = () => {
  const router = useRouter()

  const { user } = useContext(UserContext)

  console.log(user)

  return (
    <StatusLayout>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Aðstoðin þín
        </Text>
        <Text as="h2" variant="h3" color="blue400" marginBottom={[4, 4, 7]}>
          Til útgreiðslu í júní 2021??
        </Text>
      </FormContentContainer>
      <FormFooter
        onPrevButtonClick={() => {}}
        prevButtonText="Skrá sig út"
        previousIsDestructive={true}
        hideNextButton={true}
      />
    </StatusLayout>
  )
}

export default Info
