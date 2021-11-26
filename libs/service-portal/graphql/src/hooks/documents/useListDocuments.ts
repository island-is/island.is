import { useQuery } from '@apollo/client'
import { Document, Query } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'
import uniqBy from 'lodash/uniqBy'

interface UseListDocumentsProps {
  data: {
    documents: Document[]
    categories: { label: string; value: string }[]
  }
  loading?: boolean
  error?: any
}

/*
TEMPORARY MOCK DATA
*/

const tempDocuments: Document[] = [
  {
    id: '1',
    date: new Date(),
    subject: 'Póstur 1',
    senderName: 'Ásdís',
    senderNatReg: 'NatReg?',
    opened: false,
    fileType: 'pdf',
    url: 'https://visir.is',
  },
  {
    id: '2',
    date: new Date(),
    subject: 'Póstur 2',
    senderName: 'Ásdís',
    senderNatReg: 'NatReg?',
    opened: true,
    fileType: 'pdf',
    url: 'https://visir.is',
  },
  {
    id: '3',
    date: new Date(),
    subject: 'Póstur 3',
    senderName: 'Ásdís',
    senderNatReg: 'NatReg?',
    opened: true,
    fileType: 'pdf',
    url: 'https://visir.is',
  },
  {
    id: '4',
    date: new Date(),
    subject: 'Póstur 4',
    senderName: 'Ásdís',
    senderNatReg: 'NatReg?',
    opened: false,
    fileType: 'pdf',
    url: 'https://visir.is',
  },
]
export const useListDocuments = (natReg: string): UseListDocumentsProps => {
  const { data, loading, error } = useQuery<Query>(LIST_DOCUMENTS)

  const documents = data?.listDocuments || []

  const allCategories = documents.map((document) => ({
    label: document.senderName,
    value: document.senderNatReg,
  }))
  // Note: Getting unique categories
  const categories = uniqBy(allCategories, (category) => category.value)
  return {
    data: { documents, categories },
    loading,
    error,
  }
}
