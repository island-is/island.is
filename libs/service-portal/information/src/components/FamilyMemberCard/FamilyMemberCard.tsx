import { ActionCard } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatNationalId,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import React, { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

interface Props {
  title: string
  nationalId: string
  familyRelation?: 'child' | 'spouse' | 'child2'
  currentUser?: boolean
}

export const FamilyMemberCard: FC<Props> = ({
  title,
  nationalId,
  currentUser,
  familyRelation,
}) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const history = useHistory()
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
          path: ServicePortalPath.Child.replace(':nationalId', nationalId),
        }
      case 'spouse':
        return {
          label: formatMessage({
            id: 'sp.family:spouse',
            defaultMessage: 'Maki',
          }),
          path: ServicePortalPath.Spouse.replace(':nationalId', nationalId),
        }
      case 'child2':
        return {
          label: formatMessage({
            id: 'sp.family:child',
            defaultMessage: 'Barn',
          }),
          path: ServicePortalPath.FamilyMember.replace(
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
          path: ServicePortalPath.FamilyMember.replace(
            ':nationalId',
            nationalId,
          ),
        }
    }
  }

  const handleClick = () =>
    history.push({
      pathname: currentUser
        ? ServicePortalPath.UserInfo
        : nationalId
        ? familyRelationData?.path
        : ServicePortalPath.UserInfo,
    })
  return (
    <ActionCard
      avatar
      heading={title}
      headingVariant="h4"
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
        label: formatMessage({
          id: 'sp.family:see-info',
          defaultMessage: 'Skoða nánar',
        }),
        variant: 'text',
        onClick: () => handleClick(),
      }}
    />
  )
}
