import { AuthDelegationsIncomingQuery } from '../components/delegations/incoming/DelegationIncoming.generated'
import { AuthDelegationQuery } from '../screens/AccessOutgoing/AccessOutgoing.generated'
import { AuthDelegationsOutgoingQuery } from '../components/delegations/outgoing/DelegationsOutgoing.generated'

export type AuthCustomDelegationIncoming = Extract<
  AuthDelegationsIncomingQuery['authDelegations'][number],
  { __typename?: 'AuthCustomDelegation' }
>

export type AuthCustomDelegationOutgoing = Extract<
  AuthDelegationsOutgoingQuery['authDelegations'][number],
  { __typename?: 'AuthCustomDelegation' }
>

export type OutgoingDelegation = Extract<
  AuthDelegationQuery['authDelegation'],
  { __typename?: 'AuthCustomDelegation' }
>
export type AuthCustomDelegation =
  | AuthCustomDelegationIncoming
  | AuthCustomDelegationOutgoing
  | OutgoingDelegation
