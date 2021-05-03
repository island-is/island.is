import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'


import * as styles from './personalTaxAllowanceForm.treat'

const PersonalTaxAllowanceForm = () => {

  const { form, updateForm } = useContext(FormContext)

  const options = [
    {
      label: 'Já, nýta persónuafslátt',
      checked: form?.usePersonalTaxAllowance === true
    },
    {
      label: 'Nei, vil nota persónuafslátt í annað',
      checked: form?.usePersonalTaxAllowance === false
    }
  ]

  return (
    <FormLayout activeSection={6}>
      <FormContentContainer>

        <Text as="h1" variant="h2"  marginBottom={2}>
          Viltu nota persónuafslátt?
        </Text>

        <Text marginBottom={4}>
          Lengflestir sem fá fjárhagsaðstoð kjósa að nýta sér persónuafsláttinn. 
          Almennt má segja að „Já“ sé besti kostur nema þú vitir sérstaklega um annað sem þú vilt nýta hann í.
        </Text>

        <div  className={styles.container}>

          {options.map((item, i) => {
            let index = i + 1
            return(
              <div
                key={'options-' + index }
                className={styles.radioButtonContainer}
              >
                <RadioButton
                  name={'options-' + index }
                  label={item.label}
                  value={index}
                  checked={item.checked}
                  onChange={() => {
                    updateForm({...form, usePersonalTaxAllowance: index === 1})
                  }}
                  large
                  
                />
            </div>
            )
          })}

        </div>

      </FormContentContainer>

      <FormFooter previousUrl="/umsokn/tekjur" nextUrl="/umsokn/bankaupplysingar" />
    </FormLayout>
  )
}

export default PersonalTaxAllowanceForm
