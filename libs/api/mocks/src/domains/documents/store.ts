import { createStore } from '@island.is/shared/mocking'
import { categories, document, senders } from './factories'

export const store = createStore(() => {
  const documentList = document.list(20)
  // Override id for documents to be able to check if archive works in end to end testing
  const documents = documentList.map((doc, index) => {
    return { ...doc, id: `INBOX_TESTING_${index}` }
  })

  return {
    documentsV2: {
      data: documents,
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      categories: categories,
      senders: senders,
      totalCount: documentList.length,
      types: [],
    },
    categories: categories,
    senders: senders,
  }
})
