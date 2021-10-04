import React, { useState, useContext } from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  RadioButtonContainer,
  SpouseInfo,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './relationshipstatusForm.treat'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import cn from 'classnames'

import { NavigationProps } from '@island.is/financial-aid/shared/lib'

const RelationshipstatusForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const [hasError, setHasError] = useState(false)

  const options = [
    {
      label: 'Nei, ég er ekki í sambúð',
      value: 1,
    },
    {
      label: 'Já, ég er í óstaðfestri sambúð',
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
          Hjúskaparstaða þín
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Samkvæmt upplýsingum frá Þjóðskrá ert þú ekki í staðfestri sambúð. En
          sért þú í óstaðfestri sambúð þarft þú og maki þinn bæði að skila inn
          umsókn um fjárhagsaðstoð.
        </Text>

        <Text as="h3" variant="h3" marginBottom={[3, 3, 4]}>
          Ert þú í óstaðfestri sambúð?
        </Text>

        <RadioButtonContainer
          options={options}
          error={hasError && !form?.usePersonalTaxCredit}
          isChecked={(value: number | boolean) => {
            return value === form?.usePersonalTaxCredit
          }}
          onChange={(value: number | boolean) => {
            updateForm({ ...form, usePersonalTaxCredit: value })
            if (hasError) {
              setHasError(false)
            }
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

        <SpouseInfo />
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </>
  )
}

export default RelationshipstatusForm
