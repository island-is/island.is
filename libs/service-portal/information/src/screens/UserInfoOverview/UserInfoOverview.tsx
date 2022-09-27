import React from 'react'

import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  EmptyState,
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { spmm } from '../../lib/messages'
import { NATIONAL_REGISTRY_CHILDREN } from '../../lib/queries/getNationalChildren'
import { NATIONAL_REGISTRY_USER } from '../../lib/queries/getNationalRegistryUser'

const UserInfoOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')

  // Current User
  const { data, loading, error, called } = useQuery<Query>(
    NATIONAL_REGISTRY_USER,
  )
  const { nationalRegistryUser } = data || {}

  // User's Children
  const { data: childrenData, loading: childrenLoading } = useQuery<Query>(
    NATIONAL_REGISTRY_CHILDREN,
  )
  const { nationalRegistryChildren } = childrenData || {}

  const spouseData = nationalRegistryUser?.spouse

  return (
    <>
      <IntroHeader title={m.myInfo} intro={spmm.userInfoDesc} />

      <Stack space={2}>
        {called && !loading && !error && !nationalRegistryUser ? (
          <EmptyState description={m.noDataPresent} />
        ) : (
          <FamilyMemberCard
            title={userInfo.profile.name || ''}
            nationalId={userInfo.profile.nationalId}
            currentUser
          />
        )}
        {loading && <CardLoader />}
        {spouseData?.nationalId && (
          <FamilyMemberCard
            key={spouseData.nationalId}
            title={spouseData?.name || ''}
            nationalId={spouseData.nationalId}
            familyRelation="spouse"
          />
        )}
        {childrenLoading &&
          [...Array(2)].map((_key, index) => <CardLoader key={index} />)}
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
