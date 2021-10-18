import React, { useContext, useState } from 'react'
import { Text } from '@island.is/island-ui/core'
import {
  ContentContainer,
  RadioButtonContainer,
  SpouseInfo,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'
import {
  FamilyStatus,
  isEmailValid,
  Spouse,
} from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import * as styles from './relationshipStatusForm.treat'
import cn from 'classnames'
import { useRouter } from 'next/router'

interface Props {
  previousUrl?: string
  nextUrl?: string
}

const UnknownRelationshipForm = ({ previousUrl, nextUrl }: Props) => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const [acceptData, setAcceptData] = useState(false)

  const [hasError, setHasError] = useState(false)

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
    if (form?.familyStatus === undefined || !nextUrl) {
      setHasError(true)
      return
    }

    if (form?.familyStatus === FamilyStatus.NOT_INFORMED) {
      setHasError(true)
      return
    }

    if (form?.familyStatus === FamilyStatus.UNREGISTERED_COBAHITATION) {
      if (isInputAndRadioValid(acceptData, form?.spouse)) {
        setHasError(true)
        return
      }
    }

    router.push(nextUrl)
  }

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Hjúskaparstaða þín
        </Text>
        <Text variant="intro" marginBottom={[2, 2, 3]}>
          Samkvæmt upplýsingum frá Þjóðskrá ert þú ekki í staðfestri sambúð. En
          sért þú í óstaðfestri sambúð þarft bæði þú og maki þinn að skila
          innumsókn.
        </Text>
        <Text marginBottom={[3, 3, 4]}>
          Hvað þýðir það? Þú klárar að fylla út þína umsókn um fjárhagsaðstoð
          hér og maki þinn notar sín rafrænu skilríki til að skila inn
          nauðsynlegum gögnum.
          <br />
          <br />
          Úrvinnsla umsóknarinnar hefst þegar öll gögn hafa borist.
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
        previousUrl={previousUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </>
  )
}

export default UnknownRelationshipForm
