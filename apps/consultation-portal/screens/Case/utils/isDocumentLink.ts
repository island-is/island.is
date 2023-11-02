import { Document } from '../../../types/interfaces'

const isDocumentLink = (document: Document) => {
  if (document?.size === 0) {
    return true
  }
  return false
}

export default isDocumentLink
