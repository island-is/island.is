import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'


import * as styles from './employmentForm.treat'
import cn from 'classnames'

const EmploymentForm = () => {

  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const employmentOptions = [
    {
      label: 'Ég er með atvinnu'
    },
    {
      label: 'Ég er atvinnulaus'
    },
    {
      label: 'Ég er ekki vinnufær'
    },
    {
      label: 'Ekkert að ofan lýsir minni stöðu'
    }
  ]

  return (
    <FormLayout activeSection={4}>
      <FormContentContainer>

        <Text as="h1" variant="h2"  marginBottom={4}>
          Hvað lýsir stöðu þinni best?
        </Text>

        {employmentOptions.map((item, i) => {
          let index = i + 1
          return(
            <div
              key={'employmentOptions-' + index }
              className={styles.radioButtonContainer}
            >
              <RadioButton
                name={'employmentOptions-' + index }
                label={item.label}
                value={item.label}
                checked={
                  item.label ===
                  form?.employment
                }
                onChange={(event) => {
                  updateForm({...form, employment: event.target.value })
                }}
                large
                
              />
          </div>
          )
        })}


        <Box 
          marginBottom={10}
          className={cn({
            [`${styles.inputContainer}`]: true,
            [`${styles.inputAppear}`]: form?.employment === (employmentOptions[employmentOptions.length - 1].label) 
          })}
        > 
          <Input
            backgroundColor={"blue"}
            label="Lýstu þinni stöðu"
            name="employmentCustom"
            rows={8}
            textarea
            value={form?.employmentCustom}
            onChange={(event) => {
              updateForm({...form, employmentCustom: event.target.value })
            }}
          />

        </Box>

      </FormContentContainer>

      <FormFooter 
        previousUrl="/umsokn/buseta" 
        nextIsDisabled={form?.employment === ''}
        onNextButtonClick={() => {
          if(form?.employment !== (employmentOptions[employmentOptions.length - 1].label) ){
            //Validation
            updateForm({...form, employmentCustom: ''})
            router.push("/umsokn/tekjur")
          }
          else{
            router.push("/umsokn/tekjur")
          }
        }}
      />
    </FormLayout>
  )
}

export default EmploymentForm
