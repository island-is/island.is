import { useQuery } from '@apollo/client'
import { Query, QueryListDocumentsArgs } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'
import { useState } from 'react'

export const useListDocuments = (
  natReg: string,
  dateFrom: Date,
  dateTo: Date,
  page = 1,
  pageSize = 10,
  category = '',
) => {
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
          category,
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
