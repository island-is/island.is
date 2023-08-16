import { EndorsementSystemFindEndorsementListsQuery } from '../../screens/Overview/getAllEndorsementsLists.generated'
import { EndorsementSystemGetEndorsementsQuery } from '../../screens/PetitionList/getEndorsements.generated'
import { EndorsementSystemGetSingleEndorsementListQuery } from '../../screens/PetitionList/getSinglePetitionList.generated'

export type EndorsementLists =
  EndorsementSystemFindEndorsementListsQuery['endorsementSystemFindEndorsementLists']['data']

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
