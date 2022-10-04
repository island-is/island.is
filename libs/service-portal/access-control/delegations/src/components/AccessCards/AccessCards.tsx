import { AuthCustomDelegation } from '@island.is/api/schema'
import { Stack } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { AccessCard } from '../AccessCard'

type AccessCardsProps = {
  delegations: AuthCustomDelegation[]
}

export const AccessCards = ({ delegations }: AccessCardsProps) => {
  const { pathname } = useLocation()

  return (
    <Stack space={3}>
      {delegations.map(
        (delegation) =>
          delegation.to && (
            <AccessCard
              key={delegation.id}
              title={delegation.to.name}
              validTo={delegation.validTo}
              tags={delegation.scopes.map((scope) => scope.displayName)}
              href={`${pathname}/${delegation.id}`}
              group="Ísland.is"
              // TODO add conditional if card is editable
              editable
            />
          ),
      )}
    </Stack>
  )
}
