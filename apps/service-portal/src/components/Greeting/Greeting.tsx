import React, { FC } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { LEGACY_MY_PAGES_URL } from '@island.is/service-portal/constants'
import { m } from '@island.is/service-portal/core'

const Greeting: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const currentHour = new Date().getHours()
  const isEveningGreeting = currentHour > 17 || currentHour < 4

  const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'

  return (
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
  )
}

export default Greeting
