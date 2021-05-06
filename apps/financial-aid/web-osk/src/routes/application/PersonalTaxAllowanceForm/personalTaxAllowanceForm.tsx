import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './personalTaxAllowanceForm.treat'
import useFormNavigation from '../../../utils/formNavigation'
import cn from 'classnames'

const PersonalTaxAllowanceForm = () => {

  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)
  const navigation = useFormNavigation({currentId: 'personalTaxAllowance'});

  const [error, setError] = useState(false)

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
    <FormLayout activeSection={navigation?.activeSectionNumber}>
      <FormContentContainer>

        <Text as="h1" variant="h2"  marginBottom={2}>
          Viltu nota persónuafslátt?
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Lengflestir sem fá fjárhagsaðstoð kjósa að nýta sér persónuafsláttinn. 
          Almennt má segja að „Já“ sé besti kostur nema þú vitir sérstaklega um annað sem þú vilt nýta hann í.
        </Text>

        <div  className={styles.container}>

          {options.map((item, i) => {
            let index = i + 1
            return(
              <Box
                key={'options-' + index }
                marginBottom={[2,2,3]}
              >
                <RadioButton
                  name={'options-' + index }
                  label={item.label}
                  value={index}
                  checked={item.checked}
                  hasError={error && form?.usePersonalTaxAllowance === undefined}
                  onChange={() => {
                    updateForm({...form, usePersonalTaxAllowance: index === 1})
                    if(error){
                      setError(false)
                    }
                  }}
                  large
                  filled
                />
            </Box>
            )
          })}

        </div>

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && form?.usePersonalTaxAllowance === undefined
          })}
        >

          <Text
            color="red600"
            fontWeight="semiBold"
            variant="small"
          >
            Þú þarft að svara 
          </Text>

        </div>

      </FormContentContainer>

      <FormFooter 
        previousUrl={navigation?.prevUrl ?? '/'}  
        nextUrl={navigation?.nextUrl ?? '/'}
        onNextButtonClick={() => {
          if(form?.usePersonalTaxAllowance !== undefined){
            router.push(navigation?.nextUrl ?? '/')
          }
          else{
            setError(true)
          }
        }}
      />
    </FormLayout>
  )
}

export default PersonalTaxAllowanceForm
