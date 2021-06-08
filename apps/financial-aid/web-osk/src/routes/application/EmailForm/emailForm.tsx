import React, { useEffect, useState, useContext } from 'react'
import { Text, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'

import * as styles from './emailForm.treat'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { NavigationProps } from '@island.is/financial-aid/shared'
import cn from 'classnames'

const EmailForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  // const interviewOptions = [
  //   {
  //     label: 'Já, ég þigg viðtal',
  //     value: 0,
  //   },
  //   {
  //     label: 'Nei, þess þarf ekki',
  //     value: 1,
  //   },
  // ]

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Samskiptaupplýsingar
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
            onChange={(event) =>
              updateForm({ ...form, emailAddress: event.target.value })
            }
            value={form?.emailAddress}
            type="email"
            backgroundColor="blue"
            errorMessage="Athugaðu hvort netfang sé rétt slegið inn"
            hasError={error && !Boolean(form?.emailAddress)}
          />
        </Box>
        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && !form?.emailAddress,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að velja einn valmöguleika
          </Text>
        </div>

        {/* <Text as="h2" variant="h3" marginBottom={[3, 3]}>
          Má bjóða þér viðtal?
        </Text>

        <RadioButtonContainer
          className={styles.container}
          options={interviewOptions}
          isChecked={(value: string | number | boolean) => {
            return value === form?.interview
          }}
          onChange={(value: string | number | boolean) => {
            updateForm({ ...form, interview: value })
          }}
        /> */}
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        onNextButtonClick={() => {
          if (form?.emailAddress !== undefined) {
            router.push(navigation?.nextUrl ?? '/')
          } else {
            setError(true)
          }
        }}
      />
    </FormLayout>
  )
}

export default EmailForm
