import React, { useEffect, useState, useContext } from 'react'
import { Text, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './studentForm.treat'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import cn from 'classnames'
import { NavigationProps } from '@island.is/financial-aid/shared'

const StudentForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const [error, setError] = useState(false)
  const [customEducation, setCustomEducation] = useState(
    form?.student && form?.student.includes('Yes')
      ? form?.student.replace('Yes', '')
      : '',
  )

  const options = [
    {
      label: 'Nei',
      value: 'No',
    },
    {
      label: 'Já',
      value: 'Yes',
    },
  ]

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Ertu í lánshæfu námi?
        </Text>

        <div>
          <RadioButtonContainer
            options={options}
            error={error && form?.student === undefined}
            isChecked={(value: string) => {
              return form?.student && form?.student.includes(value)
            }}
            onChange={(value: string) => {
              updateForm({ ...form, student: value })
              if (error) {
                setError(false)
              }
            }}
          />
        </div>

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && form?.student === undefined,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að svara
          </Text>
        </div>
        <Box
          marginTop={1}
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]:
              form?.student && form?.student.includes('Yes'),
          })}
        >
          <Input
            backgroundColor="blue"
            label="Hvaða námi?"
            name="education"
            placeholder="Dæmi: Viðskiptafræði í HR"
            value={customEducation}
            hasError={error && form?.student === 'Yes'}
            errorMessage="Þú þarft að fylla út"
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => setCustomEducation(event.target.value)}
          />
        </Box>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextUrl={navigation?.nextUrl ?? '/'}
        onNextButtonClick={() => {
          if (form?.student !== undefined) {
            if (form?.student === 'Yes') {
              if (customEducation === '') {
                setError(true)
              } else {
                router.push(navigation?.nextUrl ?? '/')
                updateForm({
                  ...form,
                  student: 'Yes ' + customEducation,
                })
              }
            } else {
              router.push(navigation?.nextUrl ?? '/')
            }
          } else {
            setError(true)
          }
        }}
      />
    </FormLayout>
  )
}

export default StudentForm
