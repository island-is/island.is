import { Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  m,
  THJODSKRA_SLUG,
} from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'

import { Problem } from '@island.is/react-spa/shared'
import { maskString } from '@island.is/shared/utils'
import { useEffect, useState } from 'react'
import { FamilyMemberCard } from '../../../components/FamilyMemberCard/FamilyMemberCard'
import { spmm } from '../../../lib/messages'
import { useUserInfoOverviewQuery } from './UserInfoOverview.generated'

const UserInfoOverview = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const [childCards, setChildCards] = useState<JSX.Element[]>([])
  const [bioChildrenCards, setBioChildrenCards] = useState<JSX.Element[]>([])

  const { data, error, loading } = useUserInfoOverviewQuery()

  const { spouse, childCustody, biologicalChildren } =
    data?.nationalRegistryPerson || {}

  //Filter out children with custody
  const bioChildren = biologicalChildren?.filter(
    (child) => !childCustody?.some((c) => c.nationalId === child.nationalId),
  )

  useEffect(() => {
    const fetchChildCustodyData = async () => {
      try {
        if (childCustody) {
          const childrenData = await Promise.all(
            childCustody.map(async (child) => {
              const baseId = await maskString(
                child.nationalId,
                userInfo.profile.nationalId,
              )
              return (
                <FamilyMemberCard
                  key={child.nationalId}
                  title={child.fullName || ''}
                  nationalId={child.nationalId}
                  baseId={baseId ?? ''}
                  familyRelation="custody"
                />
              )
            }),
          )
          setChildCards(childrenData)
        }
        if (bioChildren) {
          const bioChildrenData = await Promise.all(
            bioChildren.map(async (child) => {
              const baseId = await maskString(
                child.nationalId,
                userInfo.profile.nationalId,
              )
              return (
                <FamilyMemberCard
                  key={child.nationalId}
                  title={child.fullName || ''}
                  nationalId={child.nationalId}
                  baseId={baseId ?? ''}
                  familyRelation="bio-child"
                />
              )
            }),
          )
          setBioChildrenCards(bioChildrenData)
        }
      } catch (e) {
        console.error('Failed setting childCards', e)
      }
    }

    fetchChildCustodyData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, userInfo.profile.nationalId])

  return (
    <IntroWrapper
      title={m.myInfo}
      intro={spmm.userInfoDesc}
      serviceProviderSlug={THJODSKRA_SLUG}
      serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
    >
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
            title={data.nationalRegistryPerson?.name?.fullName || ''}
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
          {bioChildrenCards}
        </Stack>
      )}
    </IntroWrapper>
  )
}
export default UserInfoOverview
