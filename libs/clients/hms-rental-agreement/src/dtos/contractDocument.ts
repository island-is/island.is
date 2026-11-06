import { type ContractDocumentItem } from '../../gen/fetch'

export interface ContractDocumentItemDto {
  id: number
  mime?: string
  name: string
  document: string
}

export const mapContractDocumentItemDto = (
  data: ContractDocumentItem,
): ContractDocumentItemDto | null => {
  if (!data.document || !data.contractDocumentId) return null
  return {
    id: data.contractDocumentId,
    mime: data.documentMime ?? undefined,
    name: data.documentFilename ?? 'document.pdf',
    document: data.document,
  }
}
