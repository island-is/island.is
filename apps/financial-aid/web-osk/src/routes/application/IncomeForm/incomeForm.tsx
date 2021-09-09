import React, { useEffect, useState, useContext } from 'react'
import { Text, BulletList, Bullet, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  FormLayout,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'
import * as styles from './incomeForm.treat'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import cn from 'classnames'
import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const IncomeForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const incomeOptions = [
    {
      label: 'Já, ég hef fengið tekjur',
      value: 0,
    },
    {
      label: 'Nei, engar tekjur',
      value: 1,
    },
  ]
  const errorCheck = () => {
    if (form?.hasIncome === undefined) {
      setError(true)
      return false
    }

    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
  }

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Hefur þú fengið tekjur í þessum eða síðasta mánuði?
        </Text>

        <RadioButtonContainer
          className={styles.container}
          options={incomeOptions}
          error={error && !form?.hasIncome}
          isChecked={(value: number | boolean) => {
            return value === form?.hasIncome
          }}
          onChange={(value: number | boolean) => {
            updateForm({ ...form, hasIncome: value })
            if (error) {
              setError(false)
            }
          }}
        />

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: error && form?.hasIncome === undefined,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að velja einn valmöguleika
          </Text>
        </div>

        <Text as="h2" variant="h3" marginBottom={2} marginTop={[3, 3, 5]}>
          Dæmi um tekjur
        </Text>
        <Box marginBottom={5}>
          <BulletList type={'ul'} space={2}>
            <Bullet>Launaseðlar</Bullet>
            <Bullet>Greiðslur frá Vinnumálastofnun</Bullet>
            <Bullet>Greiðslur frá Tryggingastofnun</Bullet>
            <Bullet>Styrkir frá lífeyrissjóðum</Bullet>
          </BulletList>
        </Box>
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </FormLayout>
  )
}

export default IncomeForm
