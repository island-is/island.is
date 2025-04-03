import { createStore } from '@island.is/shared/mocking'
import { document } from './factories'

export const store = createStore(() => {
  const documentList = document.list(10)

  return {
    documents: {
      data: documentList,
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      categories: [],
      senders: [],
      totalCount: documentList.length,
      types: [],
    },
  }
})
