import { AGREEMENT_STATUSES, PARTY_TYPES, TEMPORAL_TYPES } from './constants'

export type AgreementStatusType = typeof AGREEMENT_STATUSES[number]
export type PartyType = typeof PARTY_TYPES[number]
export type TemporalType = typeof TEMPORAL_TYPES[number]
