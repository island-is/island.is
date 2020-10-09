import { useQuery } from '@apollo/client'
import { Document, Query, QueryListDocumentsArgs } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'

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

  const mockData: Document[] = [
    {
      date: new Date(),
      id: '111',
      opened: false,
      senderName: 'Stafrænt Ísland',
      senderNatReg: '',
      subject: 'Rafræn skjöl frá Ísland.is',
    },
  ]

  return {
    data: mockData,
    loading,
    error,
  }
}
