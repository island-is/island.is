import { RegulationHistoryItem } from '@island.is/regulations'

export type UserRole = 'author' | 'editor'

export enum RegulationDraftTypes {
  base = 'base',
  amending = 'amending',
}

// ---------------------------------------------------------------------------

export enum StepNames {
  basics = 'basics',
  signature = 'signature',
  meta = 'meta',
  impacts = 'impacts',
  review = 'review',
  publish = 'publish',
}

export type Step = keyof typeof StepNames

export type Effects = Record<'past' | 'future', Array<RegulationHistoryItem>>
