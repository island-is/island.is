import { EndorsementList } from '../endorsementList.model'

export function maskEndorsementList(
  theList: EndorsementList,
  isAdmin: boolean,
): EndorsementList {
  // Masks owner from EndorsementList
  // theList.owner = 'xxxxxx-xxxx'

  // if (!isAdmin) {
  //   theList.meta = { ...theList.meta, phone: '', email: '' }
  // }
  return theList
}
