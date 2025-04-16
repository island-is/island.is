import { createStore } from '@island.is/shared/mocking'
import { categories, document, senders } from './factories'

export const store = createStore(() => {
  const documentList = document.list(20)

  return {
    documentsV2: {
      data: documentList,
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
