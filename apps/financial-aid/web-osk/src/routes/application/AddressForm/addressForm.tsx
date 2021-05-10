import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '../../../components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import * as styles from './addressForm.treat'
import cn from 'classnames'

import { useRouter } from 'next/router'
import useFormNavigation from '../../../utils/formNavigation'

const AddressForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation = useFormNavigation({ currentId: 'address' })

  console.log(router)

  const addressOptions = [
    {
      label: 'Aðalstræti 1, 220 Hafnarfjörður',
      sublabel: 'Heimilisfang samkvæmt Þjóðskrá',
    },
    {
      label: 'Ég bý annarsstaðar',
    },
  ]

  return (
    <FormLayout activeSection={navigation?.activeSectionNumber}>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Hvar býrðu?
        </Text>
        {/* Todo: make into a reuseable compoment */}
        {addressOptions.map((item, i) => {
          let index = i + 1
          return (
            <Box
              key={'addressOptions-' + index}
              marginBottom={[2, 2, 3]}
              // className={cn({
              //   [`${styles.radioButtonContainer}`]: true
              //   // [`${styles.radiobuttonError}`]: error && !form?.address
              // })}
            >
              <RadioButton
                name={'addressOptions-' + index}
                label={item.label}
                subLabel={item.sublabel}
                value={index}
                hasError={error && !form?.address}
                checked={index === form?.address}
                onChange={() => {
                  updateForm({ ...form, address: index })
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
            [`showErrorMessage`]: error && !form?.address,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að svara
          </Text>
        </div>

        <div
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]: form?.address === addressOptions.length,
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
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        onNextButtonClick={() => {
          if (form?.address) {
            if (form?.address !== addressOptions.length) {
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
    </FormLayout>
  )
}

export default AddressForm
