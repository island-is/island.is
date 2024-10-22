import { FileType } from './models/v2/documentContent.model'

export const HEALTH_CATEGORY_ID = '3'
export const LAW_AND_ORDER_CATEGORY_ID = '12'

export class DocumentTypeFilter {
  senderName!: string
  senderNationalId!: string
  subjectContains!: string
  url!: string
  fileType!: FileType
}

export const customDocuments: DocumentTypeFilter[] = [
  {
    senderName: 'Ríkisskattstjóri',
    // eslint-disable-next-line local-rules/disallow-kennitalas
    senderNationalId: '5402696029',
    subjectContains: 'Niðurstaða álagningar',
    url: 'https://thjonustusidur.rsk.is/alagningarsedill',
    fileType: FileType.URL,
  },
  {
    senderName: 'Ríkisskattstjóri',
    // eslint-disable-next-line local-rules/disallow-kennitalas
    senderNationalId: '5402696029',
    subjectContains: 'Skjöl send í undirritun fyrir umsókn',
    url: '',
    fileType: FileType.URL,
  },
]
