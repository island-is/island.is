import { document, documentDetail } from './factories'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)

  const documents = document.list(10).concat([document()])

  const detail = documentDetail
  return { documents, detail }
})
