import React from 'react'
import { useAuth } from '@island.is/auth/react'
import { Stack, Text, TopicCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ActorDelegationsQuery,
  useActorDelegationsQuery,
} from '@island.is/service-portal/graphql'

export const UserDelegations = () => {
  const { formatMessage } = useLocale()
  const { userInfo, switchUser } = useAuth()
  const { data } = useActorDelegationsQuery()
  const currentNationalId = userInfo?.profile.nationalId as string
  const actor = userInfo?.profile.act

  // Loading or no delegations.
  if (!data || data.authActorDelegations.length === 0) {
    return null
  }

  let delegations = [...data.authActorDelegations]

  if (actor) {
    // Remove the current delegation from the list.
    delegations = delegations.filter(
      (delegation) => delegation.fromNationalId !== currentNationalId,
    )

    // The server does not return a delegation for the authenticated user, so we add it manually.
    delegations.unshift({
      fromName: actor.name,
      fromNationalId: actor.nationalId,
    })
  }

  return (
    <Stack space={1}>
      <Text variant="h5" as="h5" marginBottom={1}>
        {formatMessage({
          id: 'service.portal:user-delegation-list',
          defaultMessage: `Aðgangar/umboð`,
        })}
      </Text>
      {delegations.map((delegation) => (
        <TopicCard
          key={delegation.fromNationalId}
          size="small"
          onClick={() => switchUser(delegation.fromNationalId)}
        >
          {delegation.fromName}
        </TopicCard>
      ))}
    </Stack>
  )
}
