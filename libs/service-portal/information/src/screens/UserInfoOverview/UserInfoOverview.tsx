import { Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  FootNote,
  IntroHeader,
  m,
  THJODSKRA_SLUG,
} from '@island.is/service-portal/core'
import { useUserInfo } from '@island.is/auth/react'

import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { spmm } from '../../lib/messages'
import { maskString } from '@island.is/shared/utils'
import { useUserInfoOverviewQuery } from './UserInfoOverview.generated'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useState } from 'react'

const UserInfoOverview = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const [childCards, setChildCards] = useState<JSX.Element[]>([])

  const { data, error, loading } = useUserInfoOverviewQuery()

  const { spouse, childCustody } = data?.nationalRegistryPerson || {}

  useEffect(() => {
    const fetchChildCustodyData = async () => {
      try {
        if (data?.nationalRegistryPerson?.childCustody) {
          const childrenData = await Promise.all(
            data.nationalRegistryPerson.childCustody.map(async (child) => {
              const baseId = await maskString(
                child.nationalId,
                userInfo.profile.nationalId,
              )
              return (
                <FamilyMemberCard
                  key={child.nationalId}
                  title={child.fullName || ''}
                  nationalId={child.nationalId}
                  baseId={baseId || ''}
                  familyRelation="child"
                />
              )
            }),
          )
          setChildCards(childrenData)
        }
      } catch (e) {
        console.error('Failed setting childCards', e)
      }
    }

    fetchChildCustodyData()
  }, [data, userInfo.profile.nationalId])

  return (
    <>
      <IntroHeader
        title={m.myInfo}
        intro={spmm.userInfoDesc}
        serviceProviderSlug={THJODSKRA_SLUG}
        serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !data?.nationalRegistryPerson && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && loading && (
        <Stack space={2}>
          {[...Array(3)].map((_key, index) => (
            <CardLoader key={index} />
          ))}
        </Stack>
      )}

      {!error && !loading && data?.nationalRegistryPerson && (
        <Stack space={2}>
          <FamilyMemberCard
            title={data.nationalRegistryPerson?.fullName || ''}
            nationalId={data.nationalRegistryPerson?.nationalId}
            currentUser
          />
          {spouse?.nationalId && (
            <FamilyMemberCard
              key={spouse.nationalId}
              title={spouse?.fullName || ''}
              nationalId={spouse.nationalId}
              familyRelation="spouse"
            />
          )}
          {childCards}
          <FootNote serviceProviderSlug={THJODSKRA_SLUG} />
        </Stack>
      )}
    </>
  )
}
export default UserInfoOverview
