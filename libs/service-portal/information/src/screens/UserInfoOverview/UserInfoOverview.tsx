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
import { FeatureFlagClient } from '@island.is/feature-flags'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useState, useEffect } from 'react'

const UserInfoOverview = () => {
  useNamespaces('sp.family')
  const userInfo = useUserInfo()

  const [useNatRegV3, setUseNatRegV3] = useState(false)

  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()

  /* Should use v3? */
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isserviceportalnationalregistryv3enabled`,
        false,
      )
      if (ffEnabled) {
        setUseNatRegV3(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
  }, [])

  const { data, loading, error } = useUserInfoOverviewQuery({
    variables: {
      api: useNatRegV3 ? 'v3' : undefined,
    },
  })

  const { spouse, childCustody } = data?.nationalRegistryPerson || {}

  return (
    <>
      <IntroHeader
        marginBottom={2}
        title={m.myInfo}
        intro={spmm.userInfoDesc}
      />

      <Stack space={2}>
        {!loading && !error && !data?.nationalRegistryPerson ? (
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
        {childCustody?.map((child) => (
          <FamilyMemberCard
            key={child.nationalId}
            title={child.fullName || ''}
            nationalId={child.nationalId}
            familyRelation="child"
          />
        ))}
      </Stack>
    </>
  )
}
export default UserInfoOverview
