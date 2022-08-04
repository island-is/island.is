import { FC, useState } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { m } from '@island.is/service-portal/core'
import { AuthDelegationType } from '@island.is/service-portal/graphql'
import { DelegationModal } from './DelegationModal'

const Greeting: FC<{}> = () => {
  const [toggleCloseModal, setToggleCloseModal] = useState(false)
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const currentHour = new Date().getHours()
  const isEveningGreeting = currentHour > 17 || currentHour < 4

  const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'
  const delegationTypes = userInfo?.profile?.delegationType ?? []

  const IS_LEGAL_GUARDIAN = delegationTypes.includes(
    AuthDelegationType.LegalGuardian,
  )

  const onClose = () => {
    setToggleCloseModal(true)
  }

  return (
    <>
      {IS_LEGAL_GUARDIAN && (
        <DelegationModal onClose={onClose} closeModal={toggleCloseModal} />
      )}
      <GridRow>
        <GridColumn span={['12/12', '7/12']}>
          <Box marginTop={[2, 3, 4]} data-testid="greeting">
            <Text
              variant="eyebrow"
              marginBottom={2}
              fontWeight="semiBold"
              color="purple400"
            >
              {isEveningGreeting
                ? formatMessage(m.eveningGreeting)
                : formatMessage(m.dayGreeting)}
            </Text>
            <Text variant="h1" as="h1" marginBottom={1}>
              {userInfo?.profile.name}
            </Text>
            <Text marginBottom={2}>{formatMessage(m.greetingIntro)}</Text>
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '5/12']}>
          <img
            src={`./assets/images/${IS_COMPANY ? 'coffee.svg' : 'school.svg'}`}
            alt=""
          />
        </GridColumn>
      </GridRow>
    </>
  )
}

export default Greeting
