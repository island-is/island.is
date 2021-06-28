import React, { FC } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import { useAuth } from '@island.is/auth/react'
import { LEGACY_MY_PAGES_URL } from '@island.is/service-portal/constants'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'

import * as styles from './Greeting.treat'

const NationalRegistryUserQuery = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      nationalId
      gender
    }
  }
`

const maleGreeting = defineMessage({
  id: 'service.portal:welcome-male',
  defaultMessage: 'Velkominn á mínar síður á island.is',
})

const femaleGreeting = defineMessage({
  id: 'service.portal:welcome-female',
  defaultMessage: 'Velkomin á mínar síður á island.is',
})

const nonBinaryGreeting = defineMessage({
  id: 'service.portal:welcome-nonbinary',
  defaultMessage: 'Velkomið á mínar síður á island.is',
})

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
            {isMale && formatMessage(maleGreeting)}
            {isFemale && formatMessage(femaleGreeting)}
            {isNonBinary && formatMessage(nonBinaryGreeting)}
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
          <Text marginBottom={2}>
            {formatMessage({
              id: 'service.portal:greeting-intro',
              defaultMessage: `
              Síðan er í þróun með þarfir notanda að leiðarljósi. Ef þú finnur ekki þá þjónustu sem var á eldri Mínum síðum getur þú fundið þær upplýsingar á Eldri útgáfa.
              `,
            })}
          </Text>
          <div>
            <a href={LEGACY_MY_PAGES_URL} target="_blank">
              <Button variant="text" icon="open" iconType="outline">
                {formatMessage({
                  id: 'service.portal:older-version',
                  defaultMessage: 'Eldri útgáfa',
                })}
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
