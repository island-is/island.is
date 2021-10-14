import React, { useState, useContext, useEffect } from 'react'
import {
  Box,
  Checkbox,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  RadioButtonContainer,
  SpouseInfo,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'
import cn from 'classnames'
import * as styles from './relationshipStatusForm.treat'

import {
  FamilyStatus,
  isEmailValid,
  isSpouseDataNeeded,
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
  const [isMarried, setIsMarried] = useState(
    isSpouseDataNeeded[form?.familyStatus as FamilyStatus],
  )
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

    if (form?.familyStatus === FamilyStatus.MARRIED) {
      if (!acceptData) {
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

        <Text variant="intro" marginBottom={[2, 2, 3]}>
          {isSpouseDataNeeded[form?.familyStatus as FamilyStatus]
            ? 'Þar sem þú ert í sambúð þarft þú að skila inn umsókn um fjárhagsaðstoð og maki þinn að skila inn upplýsingum um tekjur.'
            : 'Samkvæmt upplýsingum frá Þjóðskrá ert þú ekki í staðfestri sambúð. En sért þú í óstaðfestri sambúð þarft bæði þú og maki þinn að skila innumsókn.'}
        </Text>
        <Text marginBottom={[3, 3, 4]}>
          Hvað þýðir það? Þú klárar að fylla út þína umsókn um fjárhagsaðstoð
          hér og maki þinn notar sín rafrænu skilríki til að skila inn
          nauðsynlegum gögnum.
          <br />
          <br />
          Úrvinnsla umsóknarinnar hefst þegar öll gögn hafa borist.
        </Text>

        {isSpouseDataNeeded[form?.familyStatus as FamilyStatus] ? (
          <Checkbox
            name={'accept'}
            backgroundColor="blue"
            label="Ég skil að maki minn þarf líka að skila inn umsókn áður en úrvinnsla hefst"
            large
            checked={acceptData}
            onChange={(event) => {
              setHasError(false)

              setAcceptData(event.target.checked)
            }}
            hasError={hasError}
            errorMessage={'Þú þarft að samþykkja'}
          />
        ) : (
          <>
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
          </>
        )}

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

        <Box position="absolute" bottom={0}>
          <ToggleSwitchCheckbox
            label={isMarried ? 'Aðili giftur' : 'ekki giftur'}
            checked={isMarried}
            onChange={(newChecked) => {
              setIsMarried(newChecked)
              if (newChecked) {
                updateForm({ ...form, familyStatus: FamilyStatus.MARRIED })
              } else {
                updateForm({ ...form, familyStatus: FamilyStatus.NOT_INFORMED })
              }
            }}
          />
        </Box>
      </ContentContainer>

      <Footer
        previousUrl={navigation?.prevUrl}
        onNextButtonClick={() => errorCheck()}
      />
    </>
  )
}

export default RelationshipStatusForm
