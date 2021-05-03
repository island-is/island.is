import React, { useEffect, useState, useContext } from 'react'
import { Text,Input } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

const EmailForm = () => {

  const { form, updateForm } = useContext(FormContext)

  return (
    <FormLayout activeSection={1}>
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
            updateForm({...form, emailAddress: event.target.value })
          }
          value={form?.emailAddress}
          type="email"
          // errorMessage={'Nauðsynlegur reitur'}
          // hasError={email === ''}
        />

      </FormContentContainer>

      <FormFooter previousUrl="/umsokn" nextUrl="/umsokn/heimili" nextIsDisabled={form?.emailAddress === ''} />

    </FormLayout>
  )
}

export default EmailForm
