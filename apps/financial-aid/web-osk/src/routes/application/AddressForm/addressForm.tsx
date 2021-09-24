import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  Layout,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import * as styles from './addressForm.treat'
import cn from 'classnames'

import { useRouter } from 'next/router'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const AddressForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const addressOptions = [
    {
      label: 'Aðalstræti 1, 220 Hafnarfjörður',
      sublabel: 'Heimilisfang samkvæmt Þjóðskrá',
      value: 0,
    },
    {
      label: 'Ég bý annarsstaðar',
      value: 1,
    },
  ]

  return (
    <Layout>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Hvar býrðu?
        </Text>

        <RadioButtonContainer
          options={addressOptions}
          error={error && !form?.customAddress}
          isChecked={(value: string | number | boolean) => {
            return value === form?.customAddress
          }}
          onChange={(value: string | number | boolean) => {
            updateForm({ ...form, customAddress: value })
            if (error) {
              setError(false)
            }
          }}
        />

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && !form?.customAddress,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að svara
          </Text>
        </div>

        <div
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]: Boolean(form?.customAddress),
          })}
        >
          <div className={styles.homeAddress}>
            <Input
              backgroundColor="blue"
              label="Heimilisfang"
              name="address"
              placeholder="Sláðu inn götunafn og númer"
              value={form?.customHomeAddress}
              hasError={error && !Boolean(form?.customHomeAddress)}
              errorMessage="Þú þarft að fylla út"
              onChange={(event) =>
                updateForm({ ...form, customHomeAddress: event.target.value })
              }
            />
          </div>

          <div className={styles.zipCode}>
            <Input
              backgroundColor="blue"
              label="Póstnúmer"
              name="zipcode"
              placeholder="T.d. 220"
              value={form?.customPostalCode}
              hasError={error && !Boolean(form?.customPostalCode)}
              errorMessage="Þú þarft að fylla út"
              onChange={(event) =>
                updateForm({ ...form, customPostalCode: event.target.value })
              }
            />
          </div>
        </div>
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl ?? '/'}
        onNextButtonClick={() => {
          if (form?.customAddress !== undefined) {
            if (!Boolean(form?.customAddress)) {
              //Validation
              updateForm({
                ...form,
                customHomeAddress: '',
                customPostalCode: '',
              })
              router.push(navigation?.nextUrl ?? '/')
            } else {
              if (
                Boolean(form?.customHomeAddress) &&
                Boolean(form?.customPostalCode)
              ) {
                router.push(navigation?.nextUrl ?? '/')
              } else {
                setError(true)
              }
            }
          } else {
            setError(true)
          }
        }}
      />
    </Layout>
  )
}

export default AddressForm
