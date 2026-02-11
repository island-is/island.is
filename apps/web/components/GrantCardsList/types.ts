import { GrantStatus } from '@island.is/web/graphql/schema'

export type TranslationKeys = Partial<
  Record<
    | 'seeMore'
    | 'apply'
    | 'applicationOpen'
    | 'applicationClosed'
    | 'applicationOpensSoon'
    | 'applicationSeeDescription'
    | 'applicationOpensAt'
    | 'applicationEstimatedOpensAt'
    | 'applicationOpensTo'
    | 'applicationOpensToWithDay'
    | 'applicationWasOpenTo'
    | 'applicationWasOpenToAndWith'
    | 'applicationAlwaysOpen',
    string
  >
>

export const OPEN_GRANT_STATUSES = [
  GrantStatus.AlwaysOpen,
  GrantStatus.Open,
  GrantStatus.OpenWithNote,
]
