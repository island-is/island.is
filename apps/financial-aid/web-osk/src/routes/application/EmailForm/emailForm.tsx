import React, { useState, useContext } from 'react'
import { Text, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { NavigationProps } from '@island.is/financial-aid/shared'

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
    router.push(navigation?.nextUrl ?? '/')
  }

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
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
            name="email"
            label="Netfang"
            placeholder="Sláðu inn netfang"
            onChange={(event) => {
              if (hasError) {
                setHasError(false)
              }
              updateForm({ ...form, emailAddress: event.target.value })
            }}
            value={form?.emailAddress}
            type="email"
            backgroundColor="blue"
            errorMessage="Athugaðu hvort netfang sé rétt slegið inn"
            hasError={hasError}
          />
        </Box>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </FormLayout>
  )
}

export default EmailForm
