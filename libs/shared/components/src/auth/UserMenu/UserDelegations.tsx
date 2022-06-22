import React from 'react'
import { Stack, Text, SkeletonLoader, Box } from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { userMessages } from '@island.is/shared/translations'
import { ActorDelegationsQuery } from '../../../gen/graphql'
import { UserTopicCard } from './UserTopicCard'
import { QueryResult } from '@apollo/client'
import { UserDropdownItem } from './UserDropdownItem'
import { useAuth } from '@island.is/auth/react'

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
  const { switchUser } = useAuth()

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
  return (
    <Box>
      <Stack space={1}>
        {!!actor && (
          <UserTopicCard
            colorScheme="blue"
            onClick={() => onSwitchUser(actor?.nationalId)}
          >
            {actor?.name}
          </UserTopicCard>
        )}
        <UserDropdownItem
          text={formatMessage(userMessages.switchUser)}
          icon={{ icon: 'reload', type: 'outline' }}
          onClick={() => switchUser()}
        />
        {data.loading ? (
          <SkeletonLoader display="block" height={59} borderRadius="large" />
        ) : data.error ? (
          <Text color="red400">
            {formatMessage(userMessages.delegationError)}
          </Text>
        ) : null}
      </Stack>
    </Box>
  )
}
