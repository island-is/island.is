import React, { FC } from 'react'
import { User } from 'oidc-client'
import { defineMessage } from 'react-intl'
import { useQuery, gql } from '@apollo/client'
import { m } from '@island.is/service-portal/core'

import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { Query } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'

const NationalRegistryUserQuery = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      nationalId
      gender
    }
  }
`

interface Props {
  userInfo: User
  onClose: () => void
  onSubmit: () => void
}

export const IntroStep: FC<Props> = ({ userInfo, onClose, onSubmit }) => {
  const { formatMessage } = useLocale()
  const { data } = useQuery<Query>(NationalRegistryUserQuery)
  const { nationalRegistryUser } = data || {}

  const hasMaleGreeting =
    nationalRegistryUser?.gender === 'Karl' ||
    nationalRegistryUser?.gender === 'Drengur'
  const hasFemaleGreeting =
    nationalRegistryUser?.gender === 'Kona' ||
    nationalRegistryUser?.gender === 'Stúlka'
  const hasNonBinaryGreeting = nationalRegistryUser?.gender === 'Kynsegin'

  return (
    <>
      <GridRow>
        <GridColumn order={[2, 2, 1]} span={['1/1', '1/1', '4/7']}>
          <Text variant="h5" as="h5" color="roseTinted400" marginBottom={1}>
            {formatMessage(
              {
                id: 'sp.settings:welcome',
                defaultMessage: 'Hæ, {name}!',
                description: 'Welcome message',
              },
              {
                name: userInfo.profile.name,
              },
            )}
          </Text>
          <Text variant="h1" as="h1" marginBottom={3}>
            {hasMaleGreeting && formatMessage(m.maleGreeting)}
            {hasFemaleGreeting && formatMessage(m.femaleGreeting)}
            {hasNonBinaryGreeting && formatMessage(m.nonBinaryGreeting)}
          </Text>
          <Text>
            {formatMessage({
              id: 'sp.settings:profile-onboarding-message',
              defaultMessage: `
                Vinsamlegast farðu yfir allar þínar upplýsingar
                til þess að ganga í skugga um að þær séu réttar og
                gerðu breytingar ef þörf krefur.
              `,
            })}
          </Text>
        </GridColumn>
        <GridColumn order={[1, 1, 2]} span={['0', '0', '3/7']}>
          <img src="assets/images/jobsGrid.jpg" alt="Skrautmynd" />
        </GridColumn>
      </GridRow>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        flexWrap="wrap"
        marginTop={[4, 8]}
      >
        <Box marginBottom={[1, 0]}>
          <Button variant="ghost" onClick={onClose}>
            {formatMessage(m.finishLater)}
          </Button>
        </Box>
        <Box marginBottom={[1, 0]}>
          <Button variant="primary" onClick={onSubmit} icon="arrowForward">
            {formatMessage(m.nextStep)}
          </Button>
        </Box>
      </Box>
    </>
  )
}
