import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './homeCircumstancesForm.treat'
import cn from 'classnames'

const HomeCircumstancesForm = () => {

  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const options = [
    {
      name: '',
      label: 'Ég bý í eigin húsnæði'
    },
    {
      name: '',
      label: 'Ég leigi með þinglýstan leigusamning'
    },
    {
      name: '',
      label: 'Ég bý eða leigi hjá öðrum án leigusamnings'
    },
    {
      name: '',
      label: 'Ég bý hjá foreldrum'
    },
    {
      name: '',
      label: 'Ekkert að ofan lýsir mínum aðstæðum'
    }
  ]

//homeCircumstances
//homeCircumstancesCustom

  return (
    <FormLayout activeSection={3}>
      <FormContentContainer>

        <Text as="h1" variant="h2"  marginBottom={4}>
          Hvernig býrðu?
        </Text>

        {options.map((item, index) => {
          return(
            <div
              key={'homeCircumstancesOptions-' + index }
              className={styles.radioButtonContainer}
            >
              <RadioButton
                name={'homeCircumstancesOptions-' + index }
                label={item.label}
                value={item.label}
                checked={
                  item.label ===
                  form?.homeCircumstances
                }
                onChange={(event) => {
                  //empty homecircumstance until validation
                  updateForm({...form, homeCircumstances: event.target.value})
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
            [`${styles.inputAppear}`]: form?.homeCircumstances === (options[options.length - 1].label) 
          })}
        >
          
          <Input
            backgroundColor={"blue"}
            label="Lýstu þínum aðstæðum"
            name="homeCircumstancesCustom"
            rows={8}
            textarea
            value={form?.homeCircumstancesCustom}
            onChange={(event) => {
              updateForm({...form, homeCircumstancesCustom: event.target.value })
            }}
          />

        </Box>


      </FormContentContainer>

      <FormFooter 
        previousUrl="/umsokn/heimili" 
        nextUrl="/umsokn/stada" 
        nextIsDisabled={form?.homeCircumstances === ''}
        onNextButtonClick={() => {
          if(form?.homeCircumstances !== (options[options.length - 1].label) ){
            //Validation
            updateForm({...form, homeCircumstancesCustom: ''})
            router.push("/umsokn/stada")
          }
          else{
            router.push("/umsokn/stada")
          }
        }}
      />
      
    </FormLayout>
  )
}

export default HomeCircumstancesForm
