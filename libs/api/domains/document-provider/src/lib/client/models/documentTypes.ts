export interface DocumentTypeAndCategory {
  name?: string
  active?: boolean
}

export interface DocumentProvidedType extends DocumentTypeAndCategory {
  messageTypeId: number
}

export interface DocumentProvidedCategory extends DocumentTypeAndCategory {
  categoryId: number
}
