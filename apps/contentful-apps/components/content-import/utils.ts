import { NodeHtmlMarkdown } from 'node-html-markdown'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'

import { ReferenceFieldMappingProps } from './ReferenceFieldMapping'

export type FileData = string[][]

export const isPrimitiveField = (field: { type: string }) => {
  return (
    field.type === 'Symbol' ||
    field.type === 'Integer' ||
    field.type === 'RichText'
  )
}

export const extractContentType = (
  field: ReferenceFieldMappingProps['referenceFieldMapping'][number],
) => {
  let validations = field.contentfulField.data.validations ?? []
  if (validations.length === 0) {
    validations = field.contentfulField.data.items?.validations ?? []
  }
  return validations.find((v) => v?.linkContentType)?.linkContentType?.[0] ?? ''
}

export const convertHtmlToContentfulRichText = async (html: string) => {
  const markdown = NodeHtmlMarkdown.translate(html || '')
  return richTextFromMarkdown(markdown)
}

export const downloadCsv = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
