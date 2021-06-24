import React from 'react'
import { useQuery, gql } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Stack,
  Text,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
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

const UserInfoOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const { data, loading, error, called } = useQuery<Query>(
    NationalRegistryFamilyQuery,
  )
  const { nationalRegistryFamily } = data || {}

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {formatMessage({
                  id: 'service.portal:my-info',
                  defaultMessage: 'Mínar upplýsingar',
                })}
              </Text>
              <Text as="p" variant="intro">
                {formatMessage({
                  id: 'sp.family:user-info-description',
                  defaultMessage:
                    'Hér eru þín gögn frá þjóðskrá. Þú hefur kost á að gera breytingar á þessum gögnum.',
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
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
        <FamilyMemberCard
          title={userInfo.profile.name || ''}
          nationalId={userInfo.profile.nationalId}
          currentUser
        />
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
export default UserInfoOverview
