import React, { useEffect, useState, useContext } from 'react'
import { Text, Input } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

const EmailForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  //TODO: má ekki any hvernig er syntax?
  const navigation: any = useFormNavigation(router.pathname)

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Samskiptaupplýsingar
        </Text>
        <Text marginBottom={4}>
          Vinsamlegast staðfestu eða uppfærðu netfangið þitt svo öll samskipti
          milli þín og sveitarfélagsins gangi greiðlega fyrir sig í
          umsóknarferlinu.
        </Text>

        <Input
          name="email"
          label="Netfang"
          placeholder="Sláðu inn netfang"
          onChange={(event) =>
            updateForm({ ...form, emailAddress: event.target.value })
          }
          value={form?.emailAddress}
          type="email"
          // errorMessage={'Nauðsynlegur reitur'}
          // hasError={email === ''}
        />
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        onNextButtonClick={() => {
          // if (form?.emailAddress !== undefined) {
          router.push(navigation?.nextUrl ?? '/')
          // }
          // } else {
          //   setError(true)
          // }
        }}
        // nextUrl="/umsokn/heimili"
        // nextIsDisabled={form?.emailAddress === ''}
      />
    </FormLayout>
  )
}

export default EmailForm
