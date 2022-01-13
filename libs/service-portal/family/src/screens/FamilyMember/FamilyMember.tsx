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
  Divider,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  NotFound,
  ServicePortalModuleComponent,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

const NationalRegistryChildrenQuery = gql`
  query NationalRegistryChildrenQuery {
    nationalRegistryChildren {
      nationalId
      fullName
      displayName
      genderDisplay
      birthplace
      custody1
      custodyText1
      nameCustody1
      custody2
      custodyText2
      nameCustody2
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
    NationalRegistryChildrenQuery,
  )
  const { nationalRegistryChildren } = data || {}

  const { nationalId }: { nationalId: string | undefined } = useParams()

  const person =
    nationalRegistryChildren?.find((x) => x.nationalId === nationalId) || null

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
          label={defineMessage(m.fullName)}
          content={person?.fullName || '...'}
          loading={loading}
        />
        <UserInfoLine
          label={defineMessage(m.displayName)}
          content={person?.displayName || '...'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.natreg)}
          content={formatNationalId(nationalId)}
          loading={loading}
        />
        <UserInfoLine
          label={defineMessage(m.gender)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.genderDisplay || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.family:birthplace',
            defaultMessage: 'Fæðingarstaður',
          })}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.birthplace || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.family:parents',
            defaultMessage: 'Foreldrar',
          })}
          renderContent={() =>
            error ? (
              <span>{formatMessage(dataNotFoundMessage)}</span>
            ) : (
              <Box>
                <Box marginBottom={2}>
                  <Text fontWeight="semiBold" variant="small">
                    {person?.custodyText1}
                  </Text>
                  <Text variant="small">{person?.nameCustody1} </Text>
                  <Text variant="small">
                    {person?.custody1 ? formatNationalId(person.custody1) : ''}{' '}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="semiBold" variant="small">
                    {person?.custodyText2}
                  </Text>
                  <Text variant="small">{person?.nameCustody2} </Text>
                  <Text variant="small">
                    {person?.custody2 ? formatNationalId(person.custody2) : ''}{' '}
                  </Text>
                </Box>
              </Box>
            )
          }
          loading={loading}
        />
      </Stack>
    </>
  )
}

export default FamilyMember
