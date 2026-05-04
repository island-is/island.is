import {
  type ContractDocumentItem,
  type ContractDocumentMetadata,
} from '../../gen/fetch'

export interface ContractDocumentMetadataDto {
  id: number
  mime: string
  name: string
}

export interface ContractDocumentItemDto {
  id: number
  mime: string
  name: string
  document: string
}

export const mapContractDocumentMetadataDto = (
  data: ContractDocumentMetadata | ContractDocumentItem,
): ContractDocumentMetadataDto | null => {
  if (!data.contract_document_id || !data.document_mime) return null
  return {
    id: data.contract_document_id,
    mime: data.document_mime,
    name: data.document_filename ?? `document-${data.contract_document_id}`,
  }
}

export const mapContractDocumentItemDto = (
  data: ContractDocumentItem,
): ContractDocumentItemDto | null => {
  if (!data.contract_document_id || !data.document_mime || !data.document) {
    return null
  }
  return {
    id: data.contract_document_id,
    mime: data.document_mime,
    name: data.document_filename ?? `document-${data.contract_document_id}`,
    document: data.document,
  }
}
