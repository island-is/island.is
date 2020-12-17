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
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  natRegGenderMessageDescriptorRecord,
  natRegMaritalStatusMessageDescriptorRecord,
} from '../../helpers/localizationHelpers'

const NationalRegistryFamilyQuery = gql`
  query NationalRegistryFamilyQuery {
    nationalRegistryFamily {
      fullName
      nationalId
      address
      gender
      maritalStatus
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
  const { data, loading, error } = useQuery<Query>(NationalRegistryFamilyQuery)
  const { nationalRegistryFamily } = data || {}
  const { nationalId }: { nationalId: string | undefined } = useParams()

  const person =
    nationalRegistryFamily?.find((x) => x.nationalId === nationalId) || null

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
              <Text variant="h1" as="h1">
                {person?.fullName || ''}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:display-name',
            defaultMessage: 'Birtingarnafn',
          })}
          content={person?.fullName || '...'}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:natreg',
            defaultMessage: 'Kennitala',
          })}
          content={formatNationalId(nationalId)}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:legal-residence',
            defaultMessage: 'Lögheimili',
          })}
          content={person?.address || '...'}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:gender',
            defaultMessage: 'Kyn',
          })}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.gender
              ? formatMessage(
                  natRegGenderMessageDescriptorRecord[person.gender],
                )
              : ''
          }
          loading={loading}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:marital-status',
            defaultMessage: 'Hjúskaparstaða',
          })}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.maritalStatus
              ? formatMessage(
                  natRegMaritalStatusMessageDescriptorRecord[
                    person?.maritalStatus
                  ],
                )
              : ''
          }
          loading={loading}
        />
      </Stack>
    </>
  )
}

export default FamilyMember
