import {
  EndorsementList,
} from '../endorsementList.model'

export function maskEndorsementList(
  theList: EndorsementList 
): EndorsementList {
  // Removes owner from object
  return {
    id: theList.id,
    counter: theList.counter,
    title: theList.title,
    description: theList.description,
    openedDate: theList.openedDate,
    closedDate: theList.closedDate,
    endorsementMetadata: theList.endorsementMetadata,
    tags: theList.tags,
    validationRules: theList.validationRules,
    adminLock: theList.adminLock,
    meta: theList.meta,
    created: theList.created,
    modified: theList.modified,
  } as EndorsementList
}
