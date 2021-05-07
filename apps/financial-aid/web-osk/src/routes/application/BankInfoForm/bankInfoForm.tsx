import React, { useEffect, useState, useContext } from 'react'
import { Text, AlertMessage, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import * as styles from './bankInfoForm.treat'
import useFormNavigation from '../../../utils/formNavigation'
import { useRouter } from 'next/router'
import cn from 'classnames'

const Form = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation = useFormNavigation({ currentId: 'bankInfo' })

  const bankOptions = [
    {
      label: 'Banki',
      id: 'bankNumber',
      name: 'bankNumber',
      placeHolder: '0000',
      maxLength: 4,
      value: form?.bankNumber,
      changeFunction: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        // TODO: ekki nota any

        if (event.target.value.length <= event.target.maxLength) {
          updateForm({ ...form, bankNumber: event.target.value })
          focusOnNextInput(event.target, 'ledger')
        }
      },
    },
    {
      label: 'Höfuðbók',
      id: 'ledger',
      name: 'ledger',
      placeHolder: '00',
      maxLength: 2,
      value: form?.ledger,
      changeFunction: (event: any) => {
        updateForm({ ...form, ledger: event.target.value })
        focusOnNextInput(event.target, 'accountNumber')
      },
    },
    {
      label: 'Bankanúmer',
      id: 'accountNumber',
      name: 'accountNumber',
      placeHolder: '000000',
      maxLength: 6,
      value: form?.accountNumber,
      changeFunction: (event: any) => {
        updateForm({ ...form, accountNumber: event.target.value })
        focusOnNextInput(event.target, 'continueButton')
      },
    },
  ]
  // TODO: fix max lenght bug
  const focusOnNextInput = (target: any, nextInputId: string) => {
    if (target.value.length >= target.maxLength) {
      const el = document.getElementById(nextInputId)
      el?.focus()
    }
  }

  const saveValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldSettings: any,
  ) => {
    if (event.target.value.length <= event.target.maxLength) {
      fieldSettings.changeFunction(event)
    }
  }

  return (
    <FormLayout activeSection={navigation?.activeSectionNumber}>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Bankareikningur
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Til að geta afgreitt umsókn rafrænt þurfum við að fá uppgefinn
          bankareikning sem er í þínu nafni.
        </Text>

        <div className={styles.bankInformationContainer}>
          {bankOptions.map((item, i) => {
            return (
              <Box
                marginBottom={[2, 2, 4]}
                className={cn({
                  [`${styles.bankNumber}`]: i === 0,
                  [`${styles.accountNumber}`]: i === bankOptions.length - 1,
                })}
              >
                <Input
                  backgroundColor="blue"
                  label={item.label}
                  id={item.id}
                  name={item.name}
                  placeholder={item.placeHolder}
                  maxLength={item.maxLength}
                  type="number"
                  value={item.value}
                  onChange={(event) => saveValue(event, item)}
                />
              </Box>
            )
          })}
        </div>

        <Box marginBottom={5} marginTop={[3, 3, 0]}>
          <AlertMessage
            type="info"
            title="Upplýsingar um bankareikning"
            message="Þér er ekki skylt að gefa upp bankaupplýsingar hér. Ef þú gefur bankaupplýsingarnar upp eru þær geymdar í gagnagrunni Stafræns Íslands. Kjósirðu að gefa ekki upp bankaupplýsingarnar á þessu stigi verður hringt í þig og óskað eftir upplýsingunum ef umsóknin verður samþykkt."
          />
        </Box>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextUrl={navigation?.nextUrl ?? '/'}
      />
    </FormLayout>
  )
}

export default Form
