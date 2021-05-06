import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './studentForm.treat'

import useFormNavigation from '../../../utils/formNavigation'
import cn from 'classnames'

const StudentForm = () => {

  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)
  const navigation = useFormNavigation({currentId: 'personalTaxAllowance'});

  const [error, setError] = useState(false)

  const options = [
    {
      label: 'Já',
      checked: form?.student === true
    },
    {
      label: 'Nei',
      checked: form?.student === false
    }
  ]

  return (
    <FormLayout activeSection={navigation?.activeSectionNumber}>
      <FormContentContainer>

        <Text as="h1" variant="h2"  marginBottom={[3,3, 4]}>
          Ertu í námi?
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
                  hasError={error && form?.student === undefined}
                  onChange={() => {
                    updateForm({...form, student: index === 1})
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
            [`showErrorMessage`]: error && form?.student === undefined
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
          if(form?.student !== undefined){
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

export default StudentForm
