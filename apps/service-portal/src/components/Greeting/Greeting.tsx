import React, { FC } from 'react'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { m } from '@island.is/service-portal/core'
import * as styles from './Greeting.css'
import { AuthDelegationType } from '@island.is/shared/types'

const Greeting: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const currentHour = new Date().getHours()
  const isEveningGreeting = currentHour > 17 || currentHour < 4

  const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'

  const delegationTypes = userInfo?.profile?.delegationType ?? []

  const isLegalGuardian = delegationTypes.includes(
    AuthDelegationType.LegalGuardian,
  )
  return (
    <GridRow
      className={
        isLegalGuardian
          ? styles.greetingContainerRelative
          : styles.greetingContainer
      }
      marginTop={4}
    >
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
          <Text variant="h2" as="h1" marginBottom={1}>
            {userInfo?.profile.name}
          </Text>
          <Text marginBottom={2}>{formatMessage(m.greetingIntro)}</Text>
        </Box>
        {isLegalGuardian && (
          <Box marginBottom={5} marginTop={4}>
            <AlertMessage
              type="info"
              title={formatMessage({
                id: 'service-portal:rights-of-a-child-title',
                defaultMessage: 'Barnasáttmálinn',
              })}
              message={formatMessage({
                id: 'service.portal:rights-of-a-child',
                defaultMessage:
                  'Samkvæmt 16.gr barnasáttmálans skulu öll börn eiga rétt á einkalífi. Lögin eiga að vernda einkalíf barna, fjölskyldur og heimili. Börn eiga líka rétt á því að samskipti þeirra við aðra, orðspor þeirra og fjölskyldna þeirra sé verndað með lögum.',
              })}
            />
          </Box>
        )}
      </GridColumn>
      {isLegalGuardian && (
        <GridColumn span={['12/12', '5/12']}>
          <Box
            height="full"
            display="flex"
            justifyContent="center"
            alignItems="flexStart"
          >
            <img
              src={`./assets/images/${
                IS_COMPANY ? 'coffee.svg' : 'dashboard.svg'
              }`}
              alt=""
            />
          </Box>
        </GridColumn>
      )}
    </GridRow>
  )
}

export default Greeting
