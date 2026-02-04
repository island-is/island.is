import { ContractDocumentItem } from '../../gen/fetch'

export interface ContractDocumentItemDto {
  id: number
  mime: string
  document: string
}

export const mapContractDocumentItemDto = (
  data: ContractDocumentItem,
): ContractDocumentItemDto | null => {
  if (!data.contractDocumentId || !data.documentMime || !data.document) {
    return null
  }
  return {
    id: data.contractDocumentId,
    mime: data.documentMime,
    document: data.document,
  }
}
