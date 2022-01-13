import React from 'react'
import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  NotFound,
  ServicePortalModuleComponent,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

const NationalRegistryCurrentUserQuery = gql`
  query NationalRegistryCurrentUserQuery {
    nationalRegistryUser {
      nationalId
      spouse {
        name
        nationalId
        cohabitant
      }
    }
  }
`

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const FamilyMember: ServicePortalModuleComponent = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const { data, loading, error, called } = useQuery<Query>(
    NationalRegistryCurrentUserQuery,
  )
  const { nationalRegistryUser } = data || {}

  const { nationalId }: { nationalId: string | undefined } = useParams()

  const person =
    nationalRegistryUser?.spouse?.nationalId === nationalId
      ? nationalRegistryUser
      : null

  if (!nationalId || error || (!loading && !person))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )

  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {person?.spouse?.name || ''}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage(m.displayName)}
          content={person?.spouse?.name || '...'}
          loading={loading}
        />
        <UserInfoLine
          label={defineMessage(m.natreg)}
          content={formatNationalId(nationalId)}
          loading={loading}
        />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.family:spouseCohab',
            defaultMessage: 'Tengsl',
          })}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.spouse?.cohabitant || ''
          }
          loading={loading}
        />
      </Stack>
    </>
  )
}

export default FamilyMember
