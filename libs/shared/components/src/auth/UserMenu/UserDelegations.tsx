import React from 'react'
import {
  Stack,
  Text,
  SkeletonLoader,
  Divider,
  Box,
} from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { userMessages } from '@island.is/shared/translations'
import { ActorDelegationsQuery } from '../../../gen/graphql'
import { UserTopicCard } from './UserTopicCard'
import { QueryResult } from '@apollo/client'
import * as styles from './UserMenu.css'
interface UserDelegationsProps {
  user: User
  onSwitchUser: (nationalId: string) => void
  data: QueryResult<ActorDelegationsQuery>
}

interface Delegation {
  nationalId: string
  name: string
  isCurrent: boolean
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
  data,
  onSwitchUser,
}: UserDelegationsProps) => {
  const { formatMessage } = useLocale()
  const actor = user.profile.actor
  const currentNationalId = user.profile.nationalId as string
  const delegations = getInitialDelegations(user)

  if (data.data) {
    delegations.push(
      ...data.data.authActorDelegations
        .map((delegation) => ({
          nationalId: delegation.from?.nationalId ?? '',
          name: delegation.from?.name ?? '',
          isCurrent: false,
        }))
        .filter(
          ({ nationalId }) => nationalId && nationalId !== currentNationalId,
        ),
    )
  }

  const onClickDelegation = (delegation: Delegation) => {
    onSwitchUser(delegation.nationalId)
  }
  return (
    <>
      <Text variant="small" marginBottom={1} paddingTop={[1, 3]}>
        {formatMessage(userMessages.delegationList)}
      </Text>
      <Box className={styles.userDelegationWrapper}>
        <Stack space={1}>
          {!!actor && (
            <UserTopicCard
              colorScheme={'purple'}
              onClick={() => onSwitchUser(actor?.nationalId)}
            >
              {actor?.name}
            </UserTopicCard>
          )}
          {delegations
            .filter(
              (delegation) => delegation.nationalId !== user.profile.nationalId,
            )
            .map((delegation) => (
              <UserTopicCard
                key={delegation.nationalId}
                colorScheme="blue"
                onClick={
                  delegation.isCurrent
                    ? undefined
                    : () => onClickDelegation(delegation)
                }
              >
                {delegation.name || delegation.nationalId}
              </UserTopicCard>
            ))}
          {data.loading ? (
            <SkeletonLoader display="block" height={59} borderRadius="large" />
          ) : data.error ? (
            <Text color="red400">
              {formatMessage(userMessages.delegationError)}
            </Text>
          ) : null}
        </Stack>
      </Box>
      <Box paddingTop={3}>
        <Divider />
      </Box>
    </>
  )
}
