import React, { useState, useContext } from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './personalTaxCreditForm.treat'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import cn from 'classnames'

import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const PersonalTaxCreditForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const [hasError, setHasError] = useState(false)

  const options = [
    {
      label: 'Já, nýta persónuafslátt',
      value: 1,
    },
    {
      label: 'Nei, ekki nýta persónuafslátt',
      value: 0,
    },
  ]

  const errorCheck = () => {
    if (form?.usePersonalTaxCredit === undefined) {
      setHasError(true)
      return
    }

    if (navigation?.nextUrl) {
      router.push(navigation?.nextUrl)
    }
  }

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Viltu nota persónuafslátt?
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Langflestir sem fá fjárhagsaðstoð kjósa að nýta sér persónuafsláttinn.
          Almennt má segja að „Já“ sé besti kostur nema þú vitir sérstaklega um
          annað sem þú vilt nýta hann í.
        </Text>

        <RadioButtonContainer
          className={styles.container}
          options={options}
          error={hasError && !form?.usePersonalTaxCredit}
          isChecked={(value: number | boolean) => {
            return value === form?.usePersonalTaxCredit
          }}
          onChange={(value: number | boolean) => {
            updateForm({ ...form, usePersonalTaxCredit: value })

            setHasError(false)
          }}
        />

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]:
              hasError && form?.usePersonalTaxCredit === undefined,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að velja einn valmöguleika
          </Text>
        </div>

        <Text
          as="h2"
          variant="h3"
          marginBottom={[1, 1, 2]}
          marginTop={[2, 2, 3]}
        >
          Nánar um persónuafslátt
        </Text>
        <Text marginBottom={[7, 7, 4]} variant="small">
          Persónuafsláttur er skattaafsláttur sem veittur er öllum einstaklingum
          eldri en 16 ára. Persónuafslætti má safna upp á milli mánaða og nýta
          síðar. Uppsafnaður persónuafsláttur sem ekki er nýttur innan árs
          fellur niður við lok þess.
        </Text>
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </>
  )
}

export default PersonalTaxCreditForm
