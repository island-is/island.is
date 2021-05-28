import React, { useEffect, useState, useContext } from 'react'
import { Text } from '@island.is/island-ui/core'

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

  const options = [
    {
      label: 'Nei',
      value: 'No',
    },
    {
      label: 'Já',
      value: 'Yes',
    },
    {
      label: 'Ekki viss',
      value: 'Unsure',
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
            isChecked={(value: string | number | boolean) => {
              return value === form?.student
            }}
            onChange={(value: string | number | boolean) => {
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
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextUrl={navigation?.nextUrl ?? '/'}
        onNextButtonClick={() => {
          if (form?.student !== undefined) {
            router.push(navigation?.nextUrl ?? '/')
          } else {
            setError(true)
          }
        }}
      />
    </FormLayout>
  )
}

export default StudentForm
