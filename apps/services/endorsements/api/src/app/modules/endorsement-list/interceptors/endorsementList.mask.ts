import { EndorsementList } from '../endorsement-list.model'

export function maskEndorsementList(
  endorsementList: EndorsementList,
  isListOwner: boolean,
  isAdmin: boolean,
): EndorsementList {
  // mask list owner data for everyone except list owner and admins
  if (!isListOwner && !isAdmin) {
    endorsementList.ownerNationalId = 'xxxxxx-xxxx'
    endorsementList.meta = { ...endorsementList.meta, phone: '', email: '' }
  }

  return endorsementList
}
