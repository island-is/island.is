import React, { useState, useContext } from 'react'
import { Text, Input, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  FormLayout,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './employmentForm.treat'
import cn from 'classnames'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import {
  NavigationProps,
  Employment,
  getEmploymentStatus,
} from '@island.is/financial-aid/shared/lib'

const EmploymentForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const [hasError, setHasError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const options = [
    Employment.WORKING,
    Employment.UNEMPLOYED,
    Employment.CANNOTWORK,
    Employment.OTHER,
  ].map((item) => ({
    label: getEmploymentStatus[item],
    value: item,
  }))

  const errorCheck = () => {
    if (form?.employment === undefined) {
      setHasError(true)
      return
    }

    if (
      form?.employment === Employment.OTHER &&
      !Boolean(form?.employmentCustom)
    ) {
      setHasError(true)
      return
    }

    if (form?.employment !== Employment.OTHER && form?.employmentCustom) {
      updateForm({ ...form, employmentCustom: '' })
    }

    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
  }

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Hvað lýsir stöðu þinni best?
        </Text>

        <RadioButtonContainer
          options={options}
          error={hasError && !form?.employment}
          isChecked={(value: Employment) => {
            return value === form?.employment
          }}
          onChange={(value: Employment) => {
            updateForm({ ...form, employment: value })
            if (hasError) {
              setHasError(false)
            }
          }}
        />

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: hasError && !form?.employment,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að velja einn valmöguleika
          </Text>
        </div>

        <Box
          marginTop={1}
          marginBottom={10}
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]: form?.employment === 'Other',
          })}
        >
          <Input
            backgroundColor={'blue'}
            label="Lýstu þinni stöðu"
            name="employmentCustom"
            rows={8}
            textarea
            value={form?.employmentCustom}
            hasError={hasError && !Boolean(form?.employmentCustom)}
            errorMessage="Þú þarft að skrifa í textareitinn"
            onChange={(event) => {
              updateForm({ ...form, employmentCustom: event.target.value })
            }}
          />
        </Box>
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </FormLayout>
  )
}

export default EmploymentForm
