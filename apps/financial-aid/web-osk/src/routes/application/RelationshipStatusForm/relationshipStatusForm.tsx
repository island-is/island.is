import React, { useState, useContext } from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  RadioButtonContainer,
  SpouseInfo,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import cn from 'classnames'
import * as styles from './relationshipStatusForm.treat'

import {
  FamilyStatus,
  isEmailValid,
  NavigationProps,
  Spouse,
} from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

const RelationshipStatusForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const [hasError, setHasError] = useState(false)

  const [acceptData, setAcceptData] = useState(false)

  const options = [
    {
      label: 'Nei, ég er ekki í sambúð',
      value: FamilyStatus.UNKNOWN,
    },
    {
      label: 'Já, ég er í óstaðfestri sambúð',
      value: FamilyStatus.UNREGISTERED_COBAHITATION,
    },
  ]

  const isInputAndRadioValid = (acceptData: boolean, spouse?: Spouse) => {
    return (
      !acceptData ||
      !spouse?.email ||
      !spouse?.nationalId ||
      !isEmailValid(spouse?.email) ||
      spouse?.nationalId.length !== 10
    )
  }

  const errorCheck = () => {
    if (form?.familyStatus === undefined || !navigation?.nextUrl) {
      setHasError(true)
      return
    }

    if (form?.familyStatus === FamilyStatus.UNREGISTERED_COBAHITATION) {
      if (isInputAndRadioValid(acceptData, form?.spouse)) {
        setHasError(true)
        return
      }
    }

    router.push(navigation?.nextUrl)
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
          error={hasError && !form?.familyStatus}
          isChecked={(value: FamilyStatus) => {
            return value === form?.familyStatus
          }}
          onChange={(value: FamilyStatus) => {
            updateForm({ ...form, familyStatus: value })

            setHasError(false)
          }}
        />

        <div
          className={cn({
            [`${styles.infoContainer}`]: true,
            [`${styles.showInfoContainer}`]:
              FamilyStatus.UNREGISTERED_COBAHITATION === form?.familyStatus,
          })}
        >
          <SpouseInfo
            hasError={hasError}
            acceptData={acceptData}
            setAcceptData={(event: React.ChangeEvent<HTMLInputElement>) => {
              setHasError(false)
              setAcceptData(event.target.checked)
            }}
            removeError={() => setHasError(false)}
          />
        </div>

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: hasError,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að fylla út alla reiti
          </Text>
        </div>
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </>
  )
}

export default RelationshipStatusForm
