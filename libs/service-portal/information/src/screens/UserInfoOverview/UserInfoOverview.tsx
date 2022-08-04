import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { AlertMessage, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { FamilyMemberCardLoader } from '../../components/FamilyMemberCard/FamilyMemberCardLoader'
import { spmm } from '../../lib/messages'

const NATIONAL_REGISTRY_CHILDREN = gql`
  query NationalRegistryChildrenQuery {
    nationalRegistryChildren {
      nationalId
      fullName
      displayName
    }
  }
`

const NATIONAL_REGISTRY_USER = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      spouse {
        name
        nationalId
      }
    }
  }
`

const UserInfoOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

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
      <IntroHeader title={m.myInfo} intro={spmm.family.userInfoDesc} />

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
        {spouseData?.nationalId && (
          <FamilyMemberCard
            key={spouseData.nationalId}
            title={spouseData?.name || ''}
            nationalId={spouseData.nationalId}
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
