import { EndorsementList } from '../endorsementList.model'

export function maskEndorsementList(theList: EndorsementList): EndorsementList {
  // Masks owner from EndorsementList
  theList.owner = 'xxxxxx-xxxx'
  return theList
}
