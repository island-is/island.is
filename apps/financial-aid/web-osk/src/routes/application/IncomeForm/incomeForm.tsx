import React, { useEffect, useState, useContext } from 'react'
import { Text, RadioButton, Input, Box } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '../../../components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import * as styles from './incomeForm.treat'
import useFormNavigation from '../../../utils/formNavigation'
import cn from 'classnames'

const IncomeForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation = useFormNavigation({ currentId: 'income' })

  const incomeOptions = [
    {
      label: 'Já, ég hef fengið tekjur',
      checked: form?.hasIncome === true,
    },
    {
      label: 'Nei, engar tekjur',
      checked: form?.hasIncome === false,
    },
  ]

  return (
    <FormLayout activeSection={navigation?.activeSectionNumber}>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Hefur þú fengið tekjur í þessum eða síðasta mánuði?
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Til dæmis launatekjur eða hvers konar greiðslur eða styrkir frá
          stofnunum fyrir utan fjárhagsaðstoð Hafnarfjarðar.
        </Text>

        <div className={styles.container}>
          {incomeOptions.map((item, i) => {
            let index = i + 1
            return (
              <Box key={'incomeOptions-' + index} marginBottom={[2, 2, 3]}>
                <RadioButton
                  name={'incomeOptions-' + index}
                  label={item.label}
                  value={index}
                  checked={item.checked}
                  hasError={error && form?.hasIncome === undefined}
                  onChange={() => {
                    updateForm({ ...form, hasIncome: index === 1 }) // TODO: do somehting?
                    if (error) {
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
            [`showErrorMessage`]: error && form?.hasIncome === undefined,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að svara
          </Text>
        </div>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        onNextButtonClick={() => {
          if (form?.hasIncome !== undefined) {
            router.push(navigation?.nextUrl ?? '/')
          } else {
            setError(true)
          }
        }}
      />
    </FormLayout>
  )
}

export default IncomeForm
