import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import useFormNavigation from '../../../utils/formNavigation'

import * as styles from './homeCircumstancesForm.treat'
import cn from 'classnames'

const HomeCircumstancesForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation = useFormNavigation({ currentId: 'homeCircumstances' })

  const options = [
    {
      name: '',
      label: 'Ég bý í eigin húsnæði',
    },
    {
      name: '',
      label: 'Ég leigi með þinglýstan leigusamning',
    },
    {
      name: '',
      label: 'Ég bý eða leigi hjá öðrum án leigusamnings',
    },
    {
      name: '',
      label: 'Ég bý hjá foreldrum',
    },
    {
      name: '',
      label: 'Ekkert að ofan lýsir mínum aðstæðum',
    },
  ]

  //homeCircumstances
  //homeCircumstancesCustom

  return (
    <FormLayout activeSection={navigation?.activeSectionNumber}>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Hvernig býrðu?
        </Text>

        {options.map((item, index) => {
          return (
            <Box
              key={'homeCircumstancesOptions-' + index}
              marginBottom={[2, 2, 3]}
            >
              <RadioButton
                name={'homeCircumstancesOptions-' + index}
                label={item.label}
                value={item.label}
                hasError={error && !form?.homeCircumstances}
                checked={item.label === form?.homeCircumstances}
                onChange={(event) => {
                  //empty homecircumstance until validation
                  updateForm({ ...form, homeCircumstances: event.target.value })
                  if (error) {
                    setError(false)
                  }
                }}
                large
                filled
              />
            </Box>
          )
        })}

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
          marginBottom={10}
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]:
              form?.homeCircumstances === options[options.length - 1].label,
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
          // TODO: type á homeCircumstances, ekki nota seinsta value fyrir logic
          if (form?.homeCircumstances && navigation?.nextUrl) {
            if (form?.homeCircumstances !== options[options.length - 1].label) {
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
