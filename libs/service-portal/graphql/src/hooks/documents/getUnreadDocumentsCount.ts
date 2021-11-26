import { useQuery } from '@apollo/client'
import { Query, Document } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'
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

export const getUnreadDocumentsCount = () => {
  const { data } = useQuery<Query>(LIST_DOCUMENTS)
  const documents = data?.listDocuments || []
  return documents.filter((x) => x.opened === false).length
}
