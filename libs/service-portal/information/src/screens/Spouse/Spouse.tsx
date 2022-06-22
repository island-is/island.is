import React from 'react'
import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  LoadingDots,
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
import { NATIONAL_REGISTRY_USER } from '../../lib/queries/getNationalRegistryUser'
import { useLocale, useNamespaces } from '@island.is/localization'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const dataInfoSpouse = defineMessage({
  id: 'sp.family:data-info-spouse',
  defaultMessage: 'Hér fyrir neðan eru gögn um fjölskyldumeðlim.',
})

const FamilyMember: ServicePortalModuleComponent = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useQuery<Query>(NATIONAL_REGISTRY_USER)
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
            {loading ? (
              <LoadingDots />
            ) : (
              <Stack space={2}>
                <Text variant="h3" as="h1">
                  {person?.spouse?.name || ''}
                </Text>
                <Text>{formatMessage(dataInfoSpouse)}</Text>
              </Stack>
            )}
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          title={formatMessage(m.myRegistration)}
          label={defineMessage(m.fullName)}
          content={person?.spouse?.name || '...'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.natreg)}
          content={formatNationalId(nationalId)}
          loading={loading}
        />
        <Divider />
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
        <Divider />
      </Stack>
    </>
  )
}

export default FamilyMember
