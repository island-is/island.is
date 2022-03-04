import React, { useState, useContext } from 'react'
import { Text, Input, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'
import {
  NavigationProps,
  isEmailValid,
} from '@island.is/financial-aid/shared/lib'

const ContactInfo = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [hasError, setHasError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const isInputInvalid = () => {
    return (
      form?.emailAddress === undefined ||
      !isEmailValid(form?.emailAddress) ||
      form?.phoneNumber === undefined ||
      form?.phoneNumber.length !== 7
    )
  }

  const errorCheck = () => {
    if (isInputInvalid()) {
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
          Vinsamlegast sláðu inn netfang þitt og símanúmer svo öll samskipti
          milli þín og sveitarfélagsins gangi greiðlega fyrir sig í
          umsóknarferlinu.
        </Text>

        <Box marginBottom={[2, 2, 3]}>
          <Input
            autoFocus={true}
            name="email"
            label="Netfang"
            placeholder="Sláðu inn netfang"
            type="email"
            value={form?.emailAddress}
            onChange={(event) => {
              setHasError(false)

              updateForm({ ...form, emailAddress: event.target.value })
            }}
            backgroundColor="blue"
            errorMessage="Athugaðu hvort netfang sé rétt slegið inn"
            hasError={hasError && !isEmailValid(form?.emailAddress)}
          />
        </Box>

        <Box marginBottom={[2, 2, 3]}>
          <Input
            name="phoneNumber"
            maxLength={7}
            label="Símanúmer"
            placeholder="Sláðu inn símanúmer"
            type="tel"
            value={form?.phoneNumber}
            onChange={(event) => {
              setHasError(false)

              updateForm({ ...form, phoneNumber: event.target.value })
            }}
            backgroundColor="blue"
            errorMessage="Athugaðu hvort símanúmer sé rétt slegið inn, gilt símanúmer eru 7 stafir"
            hasError={hasError && form?.phoneNumber?.length !== 7}
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

export default ContactInfo
