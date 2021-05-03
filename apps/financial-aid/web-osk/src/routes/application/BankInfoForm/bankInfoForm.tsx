import React, { useEffect, useState, useContext } from 'react'
import { Text, AlertMessage, Input } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'


import * as styles from './bankInfoForm.treat'

const Form = () => {

  const { form, updateForm } = useContext(FormContext)

  const focusOnNextInput = (target: any, nextInputId:string) => {
    if(target.value.length === target.maxLength){
      const el = document.getElementById(nextInputId)
      el?.focus()
    }
  }

  return (
    <FormLayout activeSection={7}>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Greiðsla fjárhagsaðstoðar
        </Text>

        <AlertMessage
          type="info"
          title="Vissir þú?"
          message="Þér er ekki skylt að gefa upp bankaupplýsingar hér. Ef þú gefur bankaupplýsingarnar upp eru þær geymdar í gagnagrunni Stafræns Íslands. Kjósirðu að gefa ekki upp bankaupplýsingarnar á þessu stigi verður hringt í þig og óskað eftir upplýsingunum ef umsóknin verður samþykkt."
        />

        <Text marginY={4}>
          Til að geta afgreitt umsókn rafrænt þurfum við að fá uppgefinn bankareikning sem er í þínu nafni.
        </Text>

        <div className={styles.bankInformationContainer}>

          <div className={styles.bankNumber}>

            <Input
              backgroundColor="blue"
              label="Banki"
              name="bankNumber"
              placeholder="0000"
              maxLength={4}
              type="number"
              value={form?.bankNumber}
              onChange={(event) => {
                updateForm({...form, bankNumber: event.target.value})
                focusOnNextInput(event.target,"ledger")
              }}
            />

          </div>
            
          <Input
            backgroundColor="blue"
            label="Höfuðbók"
            id="ledger"
            name="ledger"
            placeholder="00"
            maxLength={2}
            value={form?.ledger}
            onChange={(event) => {
              updateForm({...form, ledger: event.target.value})
              focusOnNextInput(event.target,"accountNumber")
            }}
          />

          <div className={styles.accountNumber}>

            <Input
              backgroundColor="blue"
              label="Bankanúmer"
              id="accountNumber"
              name="accountNumber"
              placeholder="000000"
              value={form?.accountNumber}
              maxLength={6}
              onChange={(event) => {
                updateForm({...form, accountNumber: event.target.value})
              }}
            />

          </div>

        </div>


      </FormContentContainer>

      <FormFooter previousUrl="/umsokn/personuafslattur" nextUrl="/umsokn/utreikningur"/>
    </FormLayout>
  )
}

export default Form
