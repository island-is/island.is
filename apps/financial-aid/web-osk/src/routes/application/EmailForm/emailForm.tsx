import React, { useState, useContext } from 'react'
import { Text, Input, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const EmailForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [hasError, setHasError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const isValid = (emailAddress: string) => {
    let re = /\S+@\S+\.\S+/
    return re.test(emailAddress)
  }

  const errorCheck = () => {
    if (form?.emailAddress === undefined) {
      setHasError(true)
      return
    }

    if (!isValid(form?.emailAddress)) {
      setHasError(true)
      return
    }

    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
  }

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Samskipti
        </Text>
        <Text marginBottom={[3, 3, 4]}>
          Vinsamlegast staðfestu eða uppfærðu netfangið þitt svo öll samskipti
          milli þín og sveitarfélagsins gangi greiðlega fyrir sig í
          umsóknarferlinu.
        </Text>

        <Box marginBottom={[1, 1, 2]}>
          <Input
            autoFocus={true}
            name="email"
            label="Netfang"
            placeholder="Sláðu inn netfang"
            type="email"
            value={form?.emailAddress}
            onChange={(event) => {
              if (hasError) {
                setHasError(false)
              }
              updateForm({ ...form, emailAddress: event.target.value })
            }}
            backgroundColor="blue"
            errorMessage="Athugaðu hvort netfang sé rétt slegið inn"
            hasError={hasError}
          />
        </Box>
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </>
  )
}

export default EmailForm
