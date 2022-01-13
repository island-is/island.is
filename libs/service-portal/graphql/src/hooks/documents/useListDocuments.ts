import { useQuery } from '@apollo/client'
import { Document, Query } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'
import uniqBy from 'lodash/uniqBy'

interface UseListDocumentsProps {
  data: {
    documents: Document[]
    categories: { label: string; value: string }[]
  }
  unreadCounter?: number
  loading?: boolean
  error?: any
}

export const useListDocuments = (natReg: string): UseListDocumentsProps => {
  const { data, loading, error } = useQuery<Query>(LIST_DOCUMENTS)

  //const documents = data?.listDocuments || []
  const documents: Document[] = [
    {
      id: '1',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '2',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '3',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '4',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '5',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '1',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '2',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '3',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '4',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '5',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '1',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '2',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '3',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '4',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '5',
      date: new Date(),

      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '1',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '2',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '3',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '4',
      date: new Date(),
      subject: 'Subject subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: true,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
    {
      id: '5',
      date: new Date(),
      subject: 'UNREAD subject',
      senderName: 'Ríkislögreglustjóri',
      senderNatReg: 'NatReg?',
      opened: false,
      fileType: 'pdf',
      url: 'https://visir.is',
    },
  ] //data?.listDocuments || []

  const allCategories = documents.map((document) => ({
    label: document.senderName,
    value: document.senderNatReg,
  }))
  // Note: Getting unique categories
  const categories = uniqBy(allCategories, (category) => category.value)
  return {
    data: { documents, categories },
    unreadCounter: documents.filter((x) => x.opened === false).length,
    loading,
    error,
  }
}
