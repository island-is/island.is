import { useLocale, useNamespaces } from '@island.is/localization'
import { formatNationalId, m } from '@island.is/service-portal/core'
import React, { FC, useEffect, useState } from 'react'
import { ActionCard } from '@island.is/service-portal/core'
import { spmm } from '../../lib/messages'
import { InformationPaths } from '../../lib/paths'

interface Props {
  title: string
  nationalId: string
  baseId?: string
  currentUser?: boolean
}

type UniqueProps =
  | {
      familyRelation?: 'child'
      baseId: string
    }
  | {
      familyRelation?: 'spouse'
      baseId?: never
    }

type FamilyMemberCardProps = UniqueProps & Props

export const FamilyMemberCard: FC<
  React.PropsWithChildren<FamilyMemberCardProps>
> = ({ title, nationalId, currentUser, familyRelation, baseId }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const [familyRelationData, setFamilyRelationData] = useState<{
    label: string
    path: string
  }>()

  useEffect(() => {
    const familyRelationObject = getFamilyRelationData()
    setFamilyRelationData(familyRelationObject)
  }, [familyRelation])

  const getFamilyRelationData = () => {
    if (familyRelation === 'spouse') {
      return {
        label: formatMessage({
          id: 'sp.family:spouse',
          defaultMessage: 'Maki',
        }),
        path: InformationPaths.Spouse,
      }
    }
    return {
      label: formatMessage({
        id: 'sp.family:child',
        defaultMessage: 'Barn',
      }),
      path: InformationPaths.Child.replace(':baseId', baseId ?? ''),
    }
  }

  const getUrl = () => {
    return currentUser
      ? InformationPaths.UserInfo
      : nationalId
      ? familyRelationData?.path
      : InformationPaths.UserInfo
  }
  return (
    <ActionCard
      image={{ type: 'avatar' }}
      translateLabel="no"
      heading={title}
      text={
        nationalId &&
        `${formatMessage(m.natreg)}: ${formatNationalId(nationalId)}`
      }
      tag={
        familyRelation === undefined
          ? undefined
          : {
              label: familyRelationData?.label || '',
              variant: 'purple',
            }
      }
      cta={{
        label: formatMessage(spmm.seeInfo),
        variant: 'text',
        url: getUrl(),
      }}
    />
  )
}
