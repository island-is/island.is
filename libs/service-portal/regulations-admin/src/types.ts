import { RegulationHistoryItem } from '@island.is/regulations'

export type UserRole = 'author' | 'editor'

// ---------------------------------------------------------------------------

export type Step = 'basics' | 'meta' | 'signature' | 'impacts' | 'review'

export type Effects = Record<'past' | 'future', Array<RegulationHistoryItem>>
