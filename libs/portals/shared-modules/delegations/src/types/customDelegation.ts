import { AuthDelegationsIncomingQuery } from '../components/delegations/incoming/DelegationIncomingModal/DelegationIncomingModal.generated'
import { AuthDelegationQuery } from '../screens/AccessOutgoing/AccessOutgoing.generated'

export type AuthCustomDelegationIncoming = Extract<
  AuthDelegationsIncomingQuery['authDelegations'][number],
  { __typename?: 'AuthCustomDelegation' }
>

export type AuthCustomDelegationOutgoing = Extract<
  AuthDelegationQuery['authDelegation'],
  { __typename?: 'AuthCustomDelegation' }
>

export type AuthCustomDelegation =
  | AuthCustomDelegationIncoming
  | AuthCustomDelegationOutgoing
