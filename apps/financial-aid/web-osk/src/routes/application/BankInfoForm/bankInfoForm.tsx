import React, { useEffect, useState, useContext } from 'react'
import { Text, AlertMessage, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import * as styles from './bankInfoForm.treat'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { useRouter } from 'next/router'
import cn from 'classnames'

import { NavigationProps } from '@island.is/financial-aid/shared'

interface BankOptionsProps {
  label: string
  id: string
  name: string
  placeHolder: string
  maxLength: number
  value: string | undefined
  changeFunction: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}

const Form = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

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
        if (event.target.value.length <= event.target.maxLength) {
          updateForm({ ...form, bankNumber: event.target.value })
          focusOnNextInput(event, 'ledger')
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
      changeFunction: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        updateForm({ ...form, ledger: event.target.value })
        focusOnNextInput(event, 'accountNumber')
      },
    },
    {
      label: 'Bankanúmer',
      id: 'accountNumber',
      name: 'accountNumber',
      placeHolder: '000000',
      maxLength: 6,
      value: form?.accountNumber,
      changeFunction: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        updateForm({ ...form, accountNumber: event.target.value })
        focusOnNextInput(event, 'continueButton')
      },
    },
  ]

  const focusOnNextInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    nextInputId: string,
  ) => {
    if (event.target.value.length >= event.target.maxLength) {
      const el = document.getElementById(nextInputId)
      el?.focus()
    }
  }

  const saveValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldSettings: BankOptionsProps,
  ) => {
    if (event.target.value.length <= event.target.maxLength) {
      fieldSettings.changeFunction(event)
    }
  }

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Greiðsla fjárhagsaðstoðar
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Til að geta afgreitt umsóknina þurfum við að fá uppgefinn
          bankareikning í þínu nafni.
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Þér er ekki skylt að gefa upp bankaupplýsingar hér. Ef þú gefur
          bankaupplýsingarnar upp verða þær geymdar í gagnagrunni Stafræns
          Íslands. Kjósirðu að gefa þær ekki upp núna verður hringt í þig og
          óskað eftir þeim ef umsóknin verður samþykkt.
        </Text>

        <div className={styles.bankInformationContainer}>
          {bankOptions.map((item, i) => {
            return (
              <Box
                key={'bankInfo' + i}
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

        {/* <Box marginBottom={5} marginTop={[3, 3, 0]}>
          <AlertMessage
            type="info"
            title="Upplýsingar um bankareikning"
            message="Þér er ekki skylt að gefa upp bankaupplýsingar hér. Ef þú gefur bankaupplýsingarnar upp eru þær geymdar í gagnagrunni Stafræns Íslands. Kjósirðu að gefa ekki upp bankaupplýsingarnar á þessu stigi verður hringt í þig og óskað eftir upplýsingunum ef umsóknin verður samþykkt."
          />
        </Box> */}
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextUrl={navigation?.nextUrl ?? '/'}
      />
    </FormLayout>
  )
}

export default Form
