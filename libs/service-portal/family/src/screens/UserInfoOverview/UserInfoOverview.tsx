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
import { NATIONAL_REGISTRY_CHILDREN } from '../../lib/queries/getNationalChildren'
import { NATIONAL_REGISTRY_USER } from '../../lib/queries/getNationalRegistryUser'
import { spmm } from '../../lib/messages'

const UserInfoOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const { data, loading, error, called } = useQuery<Query>(
    NATIONAL_REGISTRY_USER,
  )
  const { nationalRegistryUser } = data || {}

  const { data: childrenData, loading: childrenLoading } = useQuery<Query>(
    NATIONAL_REGISTRY_CHILDREN,
  )
  const { nationalRegistryChildren } = childrenData || {}

  const spouseData = nationalRegistryUser?.spouse
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
                {formatMessage(spmm.family.userInfoDesc)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        {called && !loading && !error && !nationalRegistryUser && (
          <AlertMessage type="info" title={formatMessage(m.noDataPresent)} />
        )}
        <FamilyMemberCard
          title={userInfo.profile.name || ''}
          nationalId={userInfo.profile.nationalId}
          currentUser
        />
        {loading && <FamilyMemberCardLoader />}
        {spouseData && (
          <FamilyMemberCard
            key={nationalRegistryUser?.spouse?.nationalId}
            title={nationalRegistryUser?.spouse?.name || ''}
            nationalId={nationalRegistryUser?.spouse?.nationalId || ''}
            familyRelation="spouse"
          />
        )}
        {childrenLoading &&
          [...Array(2)].map((_key, index) => (
            <FamilyMemberCardLoader key={index} />
          ))}
        {nationalRegistryChildren?.map((familyMember) => (
          <FamilyMemberCard
            key={familyMember.nationalId}
            title={familyMember.fullName || familyMember.displayName || ''}
            nationalId={familyMember.nationalId}
            familyRelation="child"
          />
        ))}
      </Stack>
    </>
  )
}
export default UserInfoOverview
