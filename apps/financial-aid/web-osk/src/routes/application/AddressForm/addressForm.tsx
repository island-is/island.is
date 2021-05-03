import React, { useEffect, useState, useCallback,useContext } from 'react'
import { Text, RadioButton,Input } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import * as styles from './addressForm.treat'
import cn from 'classnames'

import { useRouter } from 'next/router'


const AddressForm = () => {

  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const addressOptions = [
    {
      label: 'Aðalstræti 1, 220 Hafnarfjörður',
      sublabel: 'Heimilisfang samkvæmt Þjóðskrá'
    },
    {
      label: 'Ég bý annarsstaðar'
    }
  ]

  // useEffect(() => {

  //   if(address === 1){
  //     updateForm({...form, customHomeAddress: 'Aðalstræti 1', customPostalCode:'220' })
  //   }

  // }, [address])

  return (
    <FormLayout activeSection={2}>
      <FormContentContainer>

        <Text as="h1" variant="h2" marginBottom={4}>
          Hvar býrðu?
        </Text>

        {addressOptions.map((item, i) => {
          let index = i + 1
          return(
            <div
              key={'addressOptions-' + index }
              className={styles.radioButtonContainer}
            >
              <RadioButton
                name={'addressOptions-' + index }
                label={item.label}
                subLabel={item.sublabel}
                value={index}
                checked={
                  index ===
                  form?.address
                }
                onChange={() => {
                  updateForm({...form, address: index})
                }}
                large
                
              />
          </div>
          )
        })}

        <div 
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]: form?.address === addressOptions.length
          })}
        >

          <div className={styles.homeAddress}>
            <Input
              backgroundColor="blue"
              label="Heimilisfang"
              name="address"
              placeholder="Sláðu inn götunafn og númer"
              value={form?.customHomeAddress}
              onChange={(event) =>
                updateForm({...form, customHomeAddress: event.target.value })
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
              onChange={(event) =>
                updateForm({...form, customPostalCode: event.target.value })
              }
            />

          </div>

        </div>

      </FormContentContainer>

      <FormFooter 
        previousUrl="/umsokn/netfang" 
        nextIsDisabled={form?.address === 0}
        onNextButtonClick={() => {
          if(form?.address !== addressOptions.length){
            //Validation
            updateForm({...form, customHomeAddress: '', customPostalCode: ''})
            router.push("/umsokn/buseta")
          }
          else{
            router.push("/umsokn/buseta")
          }
        }}
      />


    </FormLayout>
  )
}

export default AddressForm
