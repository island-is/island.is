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
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { m } from '@island.is/service-portal/core'

import * as styles from './Greeting.css'

const NationalRegistryUserQuery = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      nationalId
      gender
    }
  }
`

const Greeting: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const { data } = useQuery<Query>(NationalRegistryUserQuery)
  const { userInfo } = useAuth()
  const currentHour = new Date().getHours()
  const isEveningGreeting = currentHour > 17 || currentHour < 4
  const { nationalRegistryUser } = data || {}

  const isMale =
    nationalRegistryUser?.gender === 'MALE' ||
    nationalRegistryUser?.gender === 'MALE_MINOR'
  const isFemale =
    nationalRegistryUser?.gender === 'FEMALE' ||
    nationalRegistryUser?.gender === 'FEMALE_MINOR'
  const isNonBinary =
    nationalRegistryUser?.gender === 'TRANSGENDER_MINOR' ||
    nationalRegistryUser?.gender === 'TRANSGENDER'
  const knownGender = isMale || isFemale || isNonBinary

  return (
    <GridRow>
      <GridColumn span={['12/12', '7/12']}>
        <Box marginTop={[2, 3, 4]}>
          <Text
            variant="eyebrow"
            marginBottom={2}
            fontWeight="semiBold"
            color="purple400"
          >
            {isMale && formatMessage(m.maleGreeting)}
            {isFemale && formatMessage(m.femaleGreeting)}
            {isNonBinary && formatMessage(m.nonBinaryGreeting)}
            {!knownGender &&
              (isEveningGreeting
                ? formatMessage({
                    defaultMessage: 'Góða kvöldið,',
                    description: 'Welcome the user during the evening',
                    id: 'service.portal:good-evening',
                  })
                : formatMessage({
                    defaultMessage: 'Góðan dag,',
                    description: 'Welcome the user during the day',
                    id: 'service.portal:good-day',
                  }))}
          </Text>
          <Text variant="h1" as="h1" marginBottom={1}>
            {userInfo?.profile.name}
          </Text>
          <Text marginBottom={2}>{formatMessage(m.greetingIntro)}</Text>
          <div>
            <a href={LEGACY_MY_PAGES_URL} target="_blank">
              <Button variant="text" icon="open" iconType="outline">
                {formatMessage(m.olderVersion)}
              </Button>
            </a>
          </div>
        </Box>
      </GridColumn>
      <GridColumn span={['12/12', '5/12']}>
        <Box className={styles.figure} />
      </GridColumn>
    </GridRow>
  )
}

export default Greeting
