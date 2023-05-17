import { EndorsementSystemFindEndorsementListsQuery } from '../../shared/queries/getAllEndorsementsLists.generated'

export type EndorsementLists = Pick<
  EndorsementSystemFindEndorsementListsQuery['endorsementSystemFindEndorsementLists'],
  'data'
>
