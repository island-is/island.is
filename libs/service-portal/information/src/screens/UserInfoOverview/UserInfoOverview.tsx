import { Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  EmptyState,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { useUserInfo } from '@island.is/auth/react'

import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { spmm } from '../../lib/messages'
import { useUserInfoOverviewQuery } from './UserInfoOverview.generated'
const UserInfoOverview = () => {
  useNamespaces('sp.family')
  const userInfo = useUserInfo()

  // Current User
  const { data, loading, error, called } = useUserInfoOverviewQuery({
    variables: { input: 'v3' },
  })
  const { spouse, children } = data?.nationalRegistryPerson || {}

  return (
    <>
      <IntroHeader title={m.myInfo} intro={spmm.userInfoDesc} />

      <Stack space={2}>
        {called && !loading && !error && !data?.nationalRegistryPerson ? (
          <EmptyState description={m.noDataPresent} />
        ) : (
          <FamilyMemberCard
            title={userInfo.profile.name || ''}
            nationalId={userInfo.profile.nationalId}
            currentUser
          />
        )}
        {loading && <CardLoader />}
        {spouse?.nationalId && (
          <FamilyMemberCard
            key={spouse.nationalId}
            title={spouse?.fullName || ''}
            nationalId={spouse.nationalId}
            familyRelation="spouse"
          />
        )}
        {loading &&
          [...Array(2)].map((_key, index) => <CardLoader key={index} />)}
        {children?.map((familyMember) => (
          <FamilyMemberCard
            key={familyMember.nationalId}
            title={familyMember.fullName || ''}
            nationalId={familyMember.nationalId}
            familyRelation="child"
          />
        ))}
      </Stack>
    </>
  )
}
export default UserInfoOverview
