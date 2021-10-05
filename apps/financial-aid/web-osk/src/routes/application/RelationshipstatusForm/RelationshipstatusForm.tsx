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
import * as styles from './relationshipstatusForm.treat'

import {
  FamilyStatus,
  isEmailValid,
  NavigationProps,
} from '@island.is/financial-aid/shared/lib'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

const RelationshipstatusForm = () => {
  const router = useRouter()

  const { user, setUser } = useContext(UserContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const [hasError, setHasError] = useState(false)

  const [acceptData, setAcceptData] = useState(false)

  const options = [
    {
      label: 'Nei, ég er ekki í sambúð',
      value: FamilyStatus.SINGLE,
    },
    {
      label: 'Já, ég er í óstaðfestri sambúð',
      value: FamilyStatus.UNREGISTEREDCOBAHITATION,
    },
  ]

  const errorCheck = () => {
    if (!user?.familyStatus) {
      setHasError(true)
      return
    }

    if (!navigation?.nextUrl) {
      return
    }

    if (user?.familyStatus === FamilyStatus.SINGLE) {
      router.push(navigation?.nextUrl)
    }

    if (user?.familyStatus === FamilyStatus.UNREGISTEREDCOBAHITATION) {
      if (!acceptData || !user.spouse?.email || !user.spouse?.nationalId) {
        setHasError(true)
        return
      }

      if (
        !isEmailValid(user.spouse?.email) ||
        user.spouse?.nationalId.length !== 10
      ) {
        setHasError(true)
        return
      }

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
          error={hasError && !user?.familyStatus}
          isChecked={(value: FamilyStatus) => {
            return value === user?.familyStatus
          }}
          onChange={(value: FamilyStatus) => {
            if (user) {
              setUser({ ...user, familyStatus: value })
            }
            if (hasError) {
              setHasError(false)
            }
          }}
        />

        <div
          className={cn({
            [`${styles.infoContainer}`]: true,
            [`${styles.showInfoContainer}`]:
              FamilyStatus.UNREGISTEREDCOBAHITATION === user?.familyStatus,
          })}
        >
          <SpouseInfo
            hasError={hasError}
            acceptData={acceptData}
            setAcceptData={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (hasError) {
                setHasError(false)
              }
              setAcceptData(event.target.checked)
            }}
            removeError={(errState) => {
              if (errState) {
                setHasError(false)
              }
            }}
          />
        </div>

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: hasError,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú verður að fylla út allar upplýsingarnar
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

export default RelationshipstatusForm
