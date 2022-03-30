import { ActionCard, Box, Button, Text, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatNationalId,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { defineMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

interface Props {
  title: string
  nationalId?: string
  familyRelation?: 'child' | 'spouse'
  currentUser?: boolean
}

export const FamilyMemberCard: FC<Props> = ({
  title,
  nationalId,
  currentUser,
  familyRelation,
}) => {
  const { formatMessage } = useLocale()
  const history = useHistory()

  const familyRelationLabel =
    familyRelation === 'child'
      ? defineMessage({
          id: 'sp.family:child',
          defaultMessage: 'Barn',
        })
      : familyRelation === 'spouse'
      ? defineMessage({
          id: 'sp.family:spouse',
          defaultMessage: 'Maki',
        })
      : defineMessage({
          id: 'sp.family:family-member',
          defaultMessage: 'Fjölskyldumeðlimur',
        })

  const link = (nationalId: string) =>
    familyRelation === 'spouse'
      ? ServicePortalPath.Spouse.replace(':nationalId', nationalId)
      : ServicePortalPath.FamilyMember.replace(':nationalId', nationalId)

  const handleClick = () =>
    history.push(
      currentUser
        ? ServicePortalPath.UserInfo
        : nationalId
        ? link(nationalId)
        : ServicePortalPath.UserInfo,
    )
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
              label: formatMessage(familyRelationLabel),
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
