import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import startOfDay from 'date-fns/startOfDay'
import { MessageDescriptor } from 'react-intl'

import { AuthCustomDelegation, AuthDelegationType } from '@island.is/api/schema'

import { m } from './messages'

export interface Person {
  name: string
  nationalId: string
}

export interface DomainView {
  name: string
  displayName: string
  organisationLogoUrl?: string | null
}

export interface DelegationScopeView {
  name: string
  displayName: string
  validFrom?: string | null
  validTo?: string | null
}

export interface DelegationView {
  id: string
  type: AuthDelegationType
  from: Person
  to: Person
  domain?: DomainView | null
  referenceId?: string | null
  validTo?: string | null
  isActive: boolean
  indexedAt?: string | null
  scopes: DelegationScopeView[]
  clientIds?: string[]
  loginClientIds?: string[]
}

export interface ClientView {
  clientId: string
  clientName?: string | null
}

export type DelegationStatusFilter = 'all' | 'active' | 'expired'

export const isDateExpired = (date?: string | null) =>
  !!date && new Date(date) < startOfDay(new Date())

export const formatDate = (date: string) =>
  format(new Date(date), 'd. MMMM yyyy', { locale: is })

export const delegationTypeMessage = (
  type: AuthDelegationType,
): MessageDescriptor => {
  switch (type) {
    case AuthDelegationType.LegalGuardian:
    case AuthDelegationType.LegalGuardianMinor:
      return m.typeLegalGuardian
    case AuthDelegationType.ProcurationHolder:
      return m.typeProcurationHolder
    case AuthDelegationType.PersonalRepresentative:
      return m.typePersonalRepresentative
    case AuthDelegationType.GeneralMandate:
      return m.typeGeneralMandate
    case AuthDelegationType.LegalRepresentative:
      return m.typeLegalRepresentative
    default:
      return m.typeCustom
  }
}

export const latestValidTo = (scopes: DelegationScopeView[]) => {
  if (scopes.length === 0 || scopes.some((s) => !s.validTo)) {
    return null
  }

  return scopes.reduce<string | null>(
    (latest, s) =>
      !latest || new Date(s.validTo as string) > new Date(latest)
        ? (s.validTo as string)
        : latest,
    null,
  )
}

export const fromCustomDelegation = (
  delegation: Pick<
    AuthCustomDelegation,
    'id' | 'type' | 'referenceId' | 'validTo'
  > & {
    indexedAt?: string | null
    from: Person
    to: Person
    domain?: DomainView | null
    scopes: DelegationScopeView[]
  },
): DelegationView => {
  const scopes = delegation.scopes
  const validTo = scopes.length
    ? latestValidTo(scopes)
    : delegation.validTo ?? null

  return {
    id:
      delegation.id ??
      `${delegation.from.nationalId}-${delegation.to.nationalId}`,
    type: delegation.type,
    from: delegation.from,
    to: delegation.to,
    // General mandates have no domain and resolve to an empty one.
    domain: delegation.domain?.name ? delegation.domain : null,
    referenceId: delegation.referenceId,
    indexedAt: delegation.indexedAt,
    validTo,
    isActive: scopes.length
      ? scopes.some((s) => !isDateExpired(s.validTo))
      : !isDateExpired(validTo),
    scopes,
  }
}

/** These types are only indexed when the recipient logs in, so they can be stale. */
export const isIndexOnlyType = (type: AuthDelegationType) =>
  type !== AuthDelegationType.Custom &&
  type !== AuthDelegationType.GeneralMandate

/** Expired delegations are kept so they can still be found with the status filter. */
const appliesToClient = (delegation: DelegationView, clientId: string) =>
  delegation.isActive
    ? !!delegation.loginClientIds?.includes(clientId)
    : !!delegation.clientIds?.includes(clientId)

export const filterDelegations = (
  delegations: DelegationView[],
  {
    status,
    clientId,
    domainName,
  }: { status: DelegationStatusFilter; clientId?: string; domainName?: string },
) =>
  delegations.filter(
    (d) =>
      (status === 'all' || (status === 'active') === d.isActive) &&
      (!clientId || appliesToClient(d, clientId)) &&
      (!domainName || d.domain?.name === domainName),
  )
