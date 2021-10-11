import React, { useState, useContext } from 'react'
import { Text, Input, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './studentForm.treat'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import cn from 'classnames'
import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const StudentForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const [hasError, setHasError] = useState(false)

  const options = [
    {
      label: 'Nei',
      value: 0,
    },
    {
      label: 'Já',
      value: 1,
    },
  ]

  const errorCheck = () => {
    if (form?.student === undefined) {
      setHasError(true)
      return
    }

    if (form?.student && !Boolean(form?.studentCustom)) {
      setHasError(true)
      return
    }

    if (!form?.student && form?.studentCustom) {
      updateForm({ ...form, studentCustom: '' })
    }

    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
  }

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Ertu í lánshæfu námi?
        </Text>

        <div>
          <RadioButtonContainer
            options={options}
            error={hasError && form?.student === undefined}
            isChecked={(value: number | boolean) => {
              return value === form?.student
            }}
            onChange={(value: number | boolean) => {
              updateForm({ ...form, student: value })

              setHasError(false)
            }}
          />
        </div>

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: hasError && form?.student === undefined,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að velja einn valmöguleika
          </Text>
        </div>
        <Box
          marginTop={1}
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]: form?.student,
          })}
        >
          <Input
            backgroundColor="blue"
            label="Hvaða námi?"
            name="education"
            placeholder="Skrifaðu hér"
            value={form?.studentCustom}
            hasError={hasError && !Boolean(form?.studentCustom)}
            errorMessage="Þú þarft að skrifa hvaða nám þú stundar. Dæmi: Viðskiptafræði í HR"
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => updateForm({ ...form, studentCustom: event.target.value })}
          />
          <Box
            marginTop={1}
            className={cn({
              [`errorMessage`]: true,
              [`showErrorMessage`]: !hasError,
            })}
          >
            <Text fontWeight="semiBold" variant="small">
              Dæmi: Viðskiptafræði í HR
            </Text>
          </Box>
        </Box>
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </>
  )
}

export default StudentForm
