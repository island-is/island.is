import React from 'react'
import { useAuth } from '@island.is/auth/react'
import {
  Stack,
  Text,
  TopicCard,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useActorDelegationsQuery } from '@island.is/service-portal/graphql'
import { m } from '@island.is/service-portal/core'

interface UserDelegationsProps {
  onSwitch?: (delegation: Delegation) => void
}

interface Delegation {
  nationalId: string
  name: string
}

export const UserDelegations = ({ onSwitch }: UserDelegationsProps) => {
  const { formatMessage } = useLocale()
  const { userInfo, switchUser } = useAuth()
  const { data, error, loading } = useActorDelegationsQuery()
  const currentNationalId = userInfo?.profile.nationalId as string
  const actor = userInfo?.profile.actor

  // Loading.
  if (loading) {
    return (
      <Stack space={1}>
        <Text variant="h5" as="h5" marginBottom={1}>
          {formatMessage(m.loadingData)}
        </Text>
        <SkeletonLoader display="block" height={59} borderRadius="large" />
      </Stack>
    )
  }

  // Error or no data.
  if (error || !data || data.authActorDelegations.length === 0) {
    return null
  }

  let delegations: Delegation[] = data.authActorDelegations.map(
    (delegation) => ({
      nationalId: delegation.from.nationalId,
      name: delegation.from.name,
    }),
  )

  if (actor) {
    // Remove the current delegation from the list.
    delegations = delegations.filter(
      (delegation) => delegation.nationalId !== currentNationalId,
    )

    // The server does not return a delegation for the authenticated user, so we add it manually.
    delegations.unshift(actor)
  }

  const onClickDelegation = (delegation: Delegation) => {
    switchUser(delegation.nationalId)
    if (onSwitch) {
      onSwitch(delegation)
    }
  }

  return (
    <Stack space={1}>
      <Text variant="h5" as="h5" marginBottom={1}>
        {formatMessage(m.userDelegationList)}
      </Text>
      {delegations.map((delegation) => (
        <TopicCard
          key={delegation.nationalId}
          size="small"
          onClick={() => onClickDelegation(delegation)}
        >
          {delegation.name || delegation.nationalId}
        </TopicCard>
      ))}
    </Stack>
  )
}
