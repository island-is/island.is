import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'

export const useUnreadDocumentsCounter = () => {
  const { data } = useQuery<Query>(LIST_DOCUMENTS)
  const documents = data?.listDocuments || []
  return documents.filter((x) => x.opened === false).length
}
