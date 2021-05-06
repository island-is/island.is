import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'


import * as styles from './employmentForm.treat'
import cn from 'classnames'

import useFormNavigation from '../../../utils/formNavigation'

const EmploymentForm = () => {

  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation = useFormNavigation({currentId: 'employment'});

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
    <FormLayout activeSection={navigation?.activeSectionNumber}>
      <FormContentContainer>

        <Text as="h1" variant="h2"  marginBottom={[3, 3, 4]}>
          Hvað lýsir stöðu þinni best?
        </Text>

        {employmentOptions.map((item, i) => {
          let index = i + 1
          return(
            <Box
              key={'employmentOptions-' + index }
              marginBottom={[2,2,3]}
            >
              <RadioButton
                name={'employmentOptions-' + index }
                label={item.label}
                value={item.label}
                hasError={error && !form?.employment}
                checked={
                  item.label ===
                  form?.employment
                }
                onChange={(event) => {
                  updateForm({...form, employment: event.target.value })
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

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && !form?.employment
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
            hasError={error && !Boolean(form?.employmentCustom)}
            errorMessage="Þú þarft að fylla út"
            onChange={(event) => {
              updateForm({...form, employmentCustom: event.target.value })
            }}
          />

        </Box>

      </FormContentContainer>

      <FormFooter 
         previousUrl={navigation?.prevUrl ?? '/'} 
        nextIsDisabled={form?.employment === ''}
        onNextButtonClick={() => {

          if(form?.employment){

            if(form?.employment !== (employmentOptions[employmentOptions.length - 1].label) ){
              //Validation
              updateForm({...form, employmentCustom: ''})
              router.push(navigation?.nextUrl ?? '/')
            }
            else{

              if(Boolean(form?.employmentCustom)){
                  router.push(navigation?.nextUrl ?? '/')
              }
              else{
                setError(true)
              }
            }
          }
          else{
            setError(true)
          }
        }}
      />
    </FormLayout>
  )
}

export default EmploymentForm
