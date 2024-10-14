import { ActiveDocumentType } from '../lib/types'

// Handling edge case for documents that cant be presented due to requiring authentication through rsk.is
const customDocument = {
  senderName: 'Ríkisskattstjóri',
  senderNatReg: '5402696029',
  subjectContains: 'Niðurstaða álagningar',
  url: 'https://thjonustusidur.rsk.is/alagningarsedill',
}

export const customUrl = (doc: ActiveDocumentType) => {
  if (
    doc.senderNatReg === customDocument.senderNatReg &&
    doc.subject.includes(customDocument.subjectContains)
  ) {
    return customDocument.url
  }
  return doc.document.url
}
