import React, { useMemo } from 'react'
import { getUserManager, useAuth, User } from '@island.is/auth/react'
import { Stack, Text, TopicCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ActorDelegationsQuery,
  useActorDelegationsQuery,
} from '@island.is/service-portal/graphql'

// The actor name and nationalId should be added to userinfo endpoint so we
// can get rid of this mess.
interface JoseUtil {
  parseJwt(
    token: string,
  ): {
    payload: {
      nationalId: string
      act?: {
        nationalId: string
      }
    }
  }
}
const getActorNationalId = (userInfo: User | null) => {
  if (!userInfo) {
    return null
  }
  const jose = (getUserManager() as any)._joseUtil as JoseUtil
  const jwt = jose.parseJwt(userInfo.access_token)
  return jwt.payload.act?.nationalId ?? jwt.payload.nationalId
}

export const UserDelegations = () => {
  const { formatMessage } = useLocale()
  const { userInfo, switchUser } = useAuth()
  const { data } = useActorDelegationsQuery()
  const currentNationalId = userInfo?.profile.nationalId as string
  const actorNationalId = useMemo(() => getActorNationalId(userInfo), [
    userInfo,
  ])
  const hasData = data && data.authActorDelegations.length > 0
  const isDelegation = currentNationalId !== actorNationalId

  if (!hasData && !isDelegation) {
    return null
  }

  let delegations = [] as ActorDelegationsQuery['authActorDelegations']
  if (data) {
    delegations.push(...data.authActorDelegations)
  }
  if (isDelegation && actorNationalId !== null) {
    delegations = delegations.filter(
      (delegation) => delegation.fromNationalId !== currentNationalId,
    )
    // Don't have the name yet. This is a temporary label until that is fixed.
    delegations.unshift({ fromName: 'Ég', fromNationalId: actorNationalId })
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
          onClick={() => switchUser(delegation.fromNationalId)}
        >
          {delegation.fromName}
        </TopicCard>
      ))}
    </Stack>
  )
}
