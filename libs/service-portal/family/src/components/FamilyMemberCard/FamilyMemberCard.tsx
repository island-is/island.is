import React, { FC } from 'react'
import { defineMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import { ActionCard, Box, Button, Stack,Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatNationalId,
  m,
  ServicePortalPath,
} from '@island.is/service-portal/core'

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
      text={
        nationalId &&
        `${formatMessage(m.natreg)}: ${formatNationalId(nationalId)}`
      }
      tag={
        familyRelation === undefined
          ? undefined
          : {
              label: familyRelationLabel.defaultMessage,
              variant: 'purple',
            }
      }
      cta={{
        label: formatMessage({
          id: 'sp.family:see-info',
          defaultMessage: 'Skoða upplýsingar',
        }),
        variant: 'text',
        onClick: () => handleClick(),
      }}
    />
  )
}
