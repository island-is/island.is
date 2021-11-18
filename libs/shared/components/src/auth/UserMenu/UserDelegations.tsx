import React, { FC } from 'react'
import {
  Stack,
  Text,
  TopicCard,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { userMessages } from '@island.is/shared/translations'
import * as styles from './UserMenu.css'
import { useActorDelegationsQuery } from '../../../gen/graphql'

interface UserDelegationsProps {
  user: User
  onSwitchUser: (nationalId: string) => void
}

interface Delegation {
  nationalId: string
  name: string
  isCurrent: boolean
}

const List: FC = ({ children }) => {
  return (
    <div className={styles.delegationsList}>
      <Stack space={2}>{children}</Stack>
    </div>
  )
}

const getInitialDelegations = (user: User): Delegation[] => {
  if (!user.profile.actor) {
    return []
  }
  return [
    {
      name: user.profile.name,
      nationalId: user.profile.nationalId,
      isCurrent: true,
    },
  ]
}

export const UserDelegations = ({
  user,
  onSwitchUser,
}: UserDelegationsProps) => {
  const { formatMessage } = useLocale()
  const actor = user.profile.actor
  const showDelegations =
    useFeatureFlag(Features.delegationsEnabled, false).value || Boolean(actor)
  const { data, error, loading } = useActorDelegationsQuery({
    skip: !showDelegations,
  })
  const currentNationalId = user.profile.nationalId as string
  const delegations = getInitialDelegations(user)

  if (data) {
    delegations.push(
      ...data.authActorDelegations
        .map((delegation) => ({
          nationalId: delegation.from.nationalId,
          name: delegation.from.name,
          isCurrent: false,
        }))
        .filter(({ nationalId }) => nationalId !== currentNationalId),
    )
  }

  // No data.
  if (delegations.length === 0 && !loading && !error) {
    return null
  }

  const onClickDelegation = (delegation: Delegation) => {
    onSwitchUser(delegation.nationalId)
  }

  return (
    <>
      <hr className={styles.hr} />
      <Text variant="h5" as="h5" marginBottom={2}>
        {formatMessage(userMessages.delegationList)}
      </Text>
      <List>
        {delegations.map((delegation) => (
          <TopicCard
            key={delegation.nationalId}
            size="small"
            tag={
              delegation.isCurrent
                ? formatMessage(userMessages.selectedDelegation)
                : undefined
            }
            onClick={
              delegation.isCurrent
                ? undefined
                : () => onClickDelegation(delegation)
            }
          >
            {delegation.name || delegation.nationalId}
          </TopicCard>
        ))}
        {loading ? (
          <SkeletonLoader display="block" height={59} borderRadius="large" />
        ) : error ? (
          <Text color="red400">
            {formatMessage(userMessages.delegationError)}
          </Text>
        ) : null}
      </List>
    </>
  )
}
