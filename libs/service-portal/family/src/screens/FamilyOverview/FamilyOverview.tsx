import React from 'react'
import { useQuery, gql } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import { AlertMessage, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { FamilyMemberCardLoader } from '../../components/FamilyMemberCard/FamilyMemberCardLoader'

const NationalRegistryFamilyQuery = gql`
  query NationalRegistryFamilyQuery {
    nationalRegistryFamily {
      nationalId
      fullName
      familyRelation
    }
  }
`

const FamilyOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const { data, loading, error, called } = useQuery<Query>(
    NationalRegistryFamilyQuery,
  )
  const { nationalRegistryFamily } = data || {}

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:family',
            defaultMessage: 'Fjölskyldan',
          })}
        </Text>
      </Box>
      {error && (
        <Box textAlign="center">
          <Text variant="h3" as="h3">
            {formatMessage({
              id: 'sp.family:could-not-fetch-family-info',
              defaultMessage:
                'Tókst ekki að sækja upplýsingar um fjölskyldu, eitthvað fór úrskeiðis',
            })}
          </Text>
        </Box>
      )}
      <Stack space={2}>
        {called && !loading && !error && nationalRegistryFamily?.length === 0 && (
          <AlertMessage
            type="info"
            title={formatMessage({
              id: 'service.portal:no-data-present',
              defaultMessage: 'Engar upplýsingar til staðar',
            })}
          />
        )}
        {loading &&
          [...Array(3)].map((_key, index) => (
            <FamilyMemberCardLoader key={index} />
          ))}
        {nationalRegistryFamily?.map((familyMember, index) => (
          <FamilyMemberCard
            key={index}
            title={familyMember.fullName}
            nationalId={familyMember.nationalId}
            familyRelation={familyMember.familyRelation}
          />
        ))}
      </Stack>
    </>
  )
}
export default FamilyOverview
