import React from 'react'
import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Divider,
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
import { Parents } from '../../components/Parents/Parents'

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
              <Text variant="h3" as="h1">
                {person?.fullName || ''}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          title={'Mín skráning'}
          label={defineMessage(m.fullName)}
          content={person?.fullName || '...'}
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
          label={defineMessage(m.legalResidence)}
          content={person?.homeAddress || '...'}
          loading={loading}
        />
        <Divider />
        <Box marginY={3} />

        <UserInfoLine
          title={formatMessage(m.baseInfo)}
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
          label={formatMessage(m.familyNumber)}
          content={
            error ? formatMessage(dataNotFoundMessage) : person?.postal || ''
          }
          loading={loading}
          tooltip={formatMessage({
            id: 'sp.family:family-number-tooltip',
            defaultMessage:
              'Fjölskyldunúmer er samtenging á milli einstaklinga á lögheimili, en veitir ekki upplýsingar um hverjir eru foreldrar barns eða forsjáraðilar.',
          })}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.religion)}
          content={
            error ? formatMessage(dataNotFoundMessage) : person?.religion || ''
          }
          loading={loading}
        />
        <Divider />
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
          label={formatMessage(m.citizenship)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.nationality || ''
          }
          loading={loading}
        />
        <Divider />
        <Box marginY={3} />
        <Parents
          title={formatMessage({
            id: 'sp.family:custody-and-parents',
            defaultMessage: 'Forsjá & foreldrar',
          })}
          label={formatMessage({
            id: 'sp.family:parents',
            defaultMessage: 'Foreldrar',
          })}
          parent1={person?.nameCustody1}
          parent2={person?.nameCustody2}
          loading={loading}
        />
        <Parents
          label={formatMessage(m.natreg)}
          parent1={person?.custody1}
          parent2={person?.custody2}
          loading={loading}
        />
        <Divider />
        <Parents
          label={formatMessage({
            id: 'sp.family:custody-parents',
            defaultMessage: 'Forsjár foreldrar',
          })}
          parent1={person?.nameCustody1}
          parent2={person?.nameCustody2}
          loading={loading}
        />
        <Parents
          label={formatMessage(m.natreg)}
          parent1={person?.custody1}
          parent2={person?.custody2}
          loading={loading}
        />
        <Parents
          label={formatMessage({
            id: 'sp.family:custody-status',
            defaultMessage: 'Staða forsjár',
          })}
          parent1={person?.custodyText1}
          parent2={person?.custodyText2}
          loading={loading}
        />
      </Stack>
    </>
  )
}

export default FamilyMember
