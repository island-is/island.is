import { EndorsementList } from '../endorsementList.model'

export function maskEndorsementList(
  endorsementList: EndorsementList,
  isListOwner: boolean,
  isAdmin: boolean,
): EndorsementList {
  // // Masks owner from EndorsementList
  // endorsementList.owner = 'xxxxxx-xxxx'

  // if (!isAdmin) {
  //   endorsementList.meta = { ...endorsementList.meta, phone: '', email: '' }
  // }

  if (isListOwner) {
    //nothing
  } else if (isAdmin) {
     //nothing
  } else {
    endorsementList.owner = 'xxxxxx-xxxx'
    endorsementList.meta = { ...endorsementList.meta, phone: '', email: '' }
  }


  return endorsementList
}
