import { type ContractDocumentItem } from '../../gen/fetch'

export interface ContractDocumentItemDto {
  id: number
  mime: string
  name: string
  document: string
}

export const mapContractDocumentItemDto = (
  data: ContractDocumentItem,
): ContractDocumentItemDto | null => {
  if (!data.document) return null
  return {
    id: data.contractDocumentId ?? 0,
    mime: data.documentMime ?? 'application/pdf',
    name: data.documentFilename ?? 'document.pdf',
    document: data.document,
  }
}
