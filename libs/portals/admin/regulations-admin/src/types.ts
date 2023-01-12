import { RegulationHistoryItem } from '@island.is/regulations'

export type UserRole = 'author' | 'editor'

// ---------------------------------------------------------------------------

export type Step =
  | 'basics'
  | 'signature'
  | 'meta'
  | 'impacts'
  | 'review'
  | 'publish'

export type Effects = Record<'past' | 'future', Array<RegulationHistoryItem>>
