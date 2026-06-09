import {
  type ContractDocumentItem,
  type ContractDocumentMetadata,
} from '../../gen/fetch'

export interface ContractDocumentMetadataDto {
  id: number
  mime: string
  name: string
}

export const mapContractDocumentMetadataDto = (
  data: ContractDocumentMetadata | ContractDocumentItem,
): ContractDocumentMetadataDto | null => {
  if (!data.contractDocumentId || !data.documentMime) return null
  return {
    id: data.contractDocumentId,
    mime: data.documentMime,
    name: data.documentFilename ?? `document-${data.contractDocumentId}`,
  }
}
