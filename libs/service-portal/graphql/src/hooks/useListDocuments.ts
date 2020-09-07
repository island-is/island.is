import { useQuery } from '@apollo/client'
import { Query, QueryListDocumentsArgs } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '..'
import { useState } from 'react'

export const useListDocuments = (natReg: string, page = 1, pageSize = 10) => {
  const [dateFrom] = useState(new Date(2010))
  const [dateTo] = useState(new Date())
  const { data, loading, error } = useQuery<Query, QueryListDocumentsArgs>(
    LIST_DOCUMENTS,
    {
      variables: {
        input: {
          page,
          pageSize,
          natReg,
          dateFrom,
          dateTo,
          category: '',
        },
      },
    },
  )

  return {
    data: data?.listDocuments || null,
    loading,
    error,
  }
}
