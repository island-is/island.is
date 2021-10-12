import React, { useState, useContext } from 'react'
import { Text, Input, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import {
  NavigationProps,
  isEmailValid,
} from '@island.is/financial-aid/shared/lib'

const ContactInfo = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [hasEmailError, setHasEmailError] = useState(false)
  const [hasPhoneNumberError, setHasPhoneNumberError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const errorCheck = () => {
    if (form?.emailAddress === undefined || !isEmailValid(form?.emailAddress)) {
      setHasEmailError(true)
      return
    }

    if (form?.phoneNumber === undefined || form?.phoneNumber.length !== 7) {
      setHasPhoneNumberError(true)
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
              setHasEmailError(false)

              updateForm({ ...form, emailAddress: event.target.value })
            }}
            backgroundColor="blue"
            errorMessage="Athugaðu hvort netfang sé rétt slegið inn"
            hasError={hasEmailError}
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
              setHasPhoneNumberError(false)

              updateForm({ ...form, phoneNumber: event.target.value })
            }}
            backgroundColor="blue"
            errorMessage="Athugaðu hvort símanúmer sé rétt slegið inn, gilt símanúmer eru 7 stafir"
            hasError={hasPhoneNumberError}
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
