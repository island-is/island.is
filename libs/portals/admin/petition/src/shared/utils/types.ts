import { EndorsementSystemFindEndorsementListsQuery } from '../../shared/queries/getAllEndorsementsLists.generated'
import { EndorsementSystemGetEndorsementsQuery } from '../queries/getEndorsements.generated'
import { EndorsementSystemGetSingleEndorsementListQuery } from '../queries/getSinglePetitionList.generated'

export type EndorsementLists = EndorsementSystemFindEndorsementListsQuery['endorsementSystemFindEndorsementLists']['data']

export type FilteredPetitions = {
  active: EndorsementLists
  closed: EndorsementLists
  locked: EndorsementLists
}

export type EndorsementList = {
  listId: string
  petition: EndorsementSystemGetSingleEndorsementListQuery['endorsementSystemGetSingleEndorsementList']
  endorsements: EndorsementSystemGetEndorsementsQuery['endorsementSystemGetEndorsements']
}
