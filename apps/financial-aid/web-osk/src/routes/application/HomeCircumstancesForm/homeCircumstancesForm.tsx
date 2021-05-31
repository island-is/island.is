import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import * as styles from './homeCircumstancesForm.treat'
import cn from 'classnames'
import {
  NavigationProps,
  getHomeCircumstances,
  HomeCircumstances,
} from '@island.is/financial-aid/shared'

const HomeCircumstancesForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const options = [
    'WithParents',
    'WithOthers',
    'OwnPlace',
    'RegisteredLease',
    'Other',
  ].map((item) => {
    return {
      label: getHomeCircumstances[item as HomeCircumstances],
      value: item,
    }
  })

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Hvernig býrðu?
        </Text>

        <RadioButtonContainer
          options={options}
          error={error && !form?.homeCircumstances}
          isChecked={(value: HomeCircumstances) => {
            return value === form?.homeCircumstances
          }}
          onChange={(value: HomeCircumstances) => {
            updateForm({ ...form, homeCircumstances: value })
            if (error) {
              setError(false)
            }
          }}
        />

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && !form?.homeCircumstances,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að svara
          </Text>
        </div>

        <Box
          marginTop={1}
          marginBottom={10}
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]: form?.homeCircumstances === 'Other',
          })}
        >
          <Input
            backgroundColor={'blue'}
            label="Lýstu þínum aðstæðum"
            name="homeCircumstancesCustom"
            rows={8}
            textarea
            value={form?.homeCircumstancesCustom}
            hasError={error && !Boolean(form?.homeCircumstancesCustom)}
            errorMessage="Þú þarft að fylla út"
            onChange={(event) => {
              updateForm({
                ...form,
                homeCircumstancesCustom: event.target.value,
              })
            }}
          />
        </Box>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        onNextButtonClick={() => {
          //Temperary error state
          //Check if any radio is checked
          if (form?.homeCircumstances && navigation?.nextUrl) {
            if (form?.homeCircumstances !== 'Other') {
              //Validation
              updateForm({ ...form, homeCircumstancesCustom: '' })
              router.push(navigation?.nextUrl)
            } else {
              if (Boolean(form?.homeCircumstancesCustom)) {
                router.push(navigation?.nextUrl)
              } else {
                setError(true)
              }
            }
          } else {
            setError(true)
          }
        }}
      />
    </FormLayout>
  )
}

export default HomeCircumstancesForm
