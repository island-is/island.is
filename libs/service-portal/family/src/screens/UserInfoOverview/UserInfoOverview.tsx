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
import { ServicePortalModuleComponent, m } from '@island.is/service-portal/core'
import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { FamilyMemberCardLoader } from '../../components/FamilyMemberCard/FamilyMemberCardLoader'

const NationalRegistryCurrentUserQuery = gql`
  query NationalRegistryCurrentUserQuery {
    nationalRegistryUser {
      nationalId
      spouseName
      spouseNationalId
      spouseCohab
    }
  }
`

const NationalRegistryChildrenQuery = gql`
  query NationalRegistryChildrenQuery {
    nationalRegistryChildren {
      nationalId
      fullName
    }
  }
`

const UserInfoOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const { data, loading, error, called } = useQuery<Query>(
    NationalRegistryCurrentUserQuery,
  )
  const { nationalRegistryUser } = data || {}

  const {
    data: childrenData,
    loading: childrenLoading,
    error: childrenError,
    called: childrenCalled,
  } = useQuery<Query>(NationalRegistryChildrenQuery)
  const { nationalRegistryChildren } = childrenData || {}

  const spouseData =
    nationalRegistryUser?.spouseCohab &&
    nationalRegistryUser.spouseName &&
    nationalRegistryUser.spouseNationalId
  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage(m.myInfo)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage({
                  id: 'sp.family:user-info-description',
                  defaultMessage:
                    'Hér eru gögn um þig og fjölskyldu þína sem sótt eru til Þjóðskrár. Með því að smella á skoða nánar er hægt að óska eftir breytingum á þeim upplýsingum.',
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      {childrenError && (
        <Box textAlign="center" marginBottom={2}>
          <Text variant="h4" as="h2">
            {formatMessage({
              id: 'sp.family:could-not-fetch-family-info',
              defaultMessage:
                'Tókst ekki að sækja upplýsingar um fjölskyldu, eitthvað fór úrskeiðis',
            })}
          </Text>
        </Box>
      )}
      <Stack space={2}>
        {childrenCalled &&
          !childrenLoading &&
          !childrenError &&
          nationalRegistryChildren?.length === 0 && (
            <AlertMessage type="info" title={formatMessage(m.noDataPresent)} />
          )}
        <FamilyMemberCard
          title={userInfo.profile.name || ''}
          nationalId={userInfo.profile.nationalId}
          currentUser
        />
        {spouseData && (
          <FamilyMemberCard
            key={nationalRegistryUser?.spouseNationalId}
            title={nationalRegistryUser?.spouseName || ''}
            nationalId={nationalRegistryUser?.spouseNationalId || ''}
            familyRelation="spouse"
          />
        )}
        {childrenLoading &&
          [...Array(3)].map((_key, index) => (
            <FamilyMemberCardLoader key={index} />
          ))}
        {nationalRegistryChildren?.map((familyMember) => (
          <FamilyMemberCard
            key={familyMember.nationalId}
            title={familyMember.fullName}
            nationalId={familyMember.nationalId}
            familyRelation="child"
          />
        ))}
      </Stack>
    </>
  )
}
export default UserInfoOverview
