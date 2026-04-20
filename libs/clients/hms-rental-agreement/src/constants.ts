import { AgreementStatusType } from './types'

export const AGREEMENT_STATUSES = [
  'valid',
  'invalid',
  'expired',
  'cancelled',
  'terminated',
  'cancellationRequested',
  'pendingCancellation',
  'pendingTermination',
  'unknown',
] as const

export const PARTY_TYPES = [
  'owner',
  'tenant',
  'agency',
  'agentForOwner',
  'agentForTenant',
  'ownerTakeover',
  'unknown',
] as const

export const TEMPORAL_TYPES = ['indefinite', 'temporary', 'unknown'] as const
export const PROPERTY_TYPES = [
  'individualRoom',
  'residential',
  'nonresidential',
  'unknown',
] as const

export const INACTIVE_AGREEMENT_STATUSES: Array<AgreementStatusType> = [
  'expired',
  'cancelled',
  'invalid',
  'terminated',
]
