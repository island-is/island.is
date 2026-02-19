import { ContractDocumentItem } from '../../gen/fetch'

export interface ContractDocumentItemDto {
  id: number
  mime: string
  name: string
  document: string
}

export const mapContractDocumentItemDto = (
  data: ContractDocumentItem,
): ContractDocumentItemDto | undefined => {
  if (
    !data.contractDocumentId ||
    !data.documentMime ||
    !data.documentFilename ||
    !data.document
  ) {
    return
  }
  return {
    id: data.contractDocumentId,
    mime: data.documentMime,
    name: data.documentFilename,
    document: data.document,
  }
}
