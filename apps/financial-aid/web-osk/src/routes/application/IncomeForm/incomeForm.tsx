import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import * as styles from './incomeForm.treat'

const IncomeForm = () => {

  const { form, updateForm } = useContext(FormContext)

  const incomeOptions = [
    {
      label: 'Ég hef fengið tekjur',
      checked: form?.hasIncome  === true
    },
    {
      label: 'Ég hef ekki fengið neinar tekjur',
      checked: form?.hasIncome === false
    }
  ]

  return (
    <FormLayout activeSection={5}>
      <FormContentContainer>

        <Text as="h1" variant="h2"  marginBottom={4}>
          Tekjur í þessum mánuði eða síðasta
        </Text>

        {incomeOptions.map((item, i) => {
          let index = i + 1
          return(
            <div
              key={'incomeOptions-' + index }
              className={styles.radioButtonContainer}
            >
              <RadioButton
                name={'incomeOptions-' + index }
                label={item.label}
                value={index}
                checked={item.checked}
                onChange={() => {
                  updateForm({...form, hasIncome: index === 1})
                }}
                large
              />
          </div>
          )
        })}
        
      </FormContentContainer>

      <FormFooter previousUrl="/umsokn/stada" nextUrl="/umsokn/personuafslattur"/>
    </FormLayout>
  )
}

export default IncomeForm
