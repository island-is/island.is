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
  familyRelation?: 'child' | 'spouse' | 'child2'
  currentUser?: boolean
}

export const FamilyMemberCard: FC<React.PropsWithChildren<Props>> = ({
  title,
  nationalId,
  currentUser,
  familyRelation,
  baseId,
}) => {
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
    switch (familyRelation) {
      case 'child':
        return {
          label: formatMessage({
            id: 'sp.family:child',
            defaultMessage: 'Barn',
          }),
          path: InformationPaths.Child.replace(':baseId', baseId ?? ''),
        }
      case 'spouse':
        return {
          label: formatMessage({
            id: 'sp.family:spouse',
            defaultMessage: 'Maki',
          }),
          path: InformationPaths.Spouse,
        }
      case 'child2':
        return {
          label: formatMessage({
            id: 'sp.family:child',
            defaultMessage: 'Barn',
          }),
          path: InformationPaths.FamilyMember.replace(
            ':nationalId',
            nationalId,
          ),
        }
      default:
        return {
          label: formatMessage({
            id: 'sp.family:family-member',
            defaultMessage: 'Fjölskyldumeðlimur',
          }),
          path: InformationPaths.FamilyMember.replace(
            ':nationalId',
            nationalId,
          ),
        }
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
