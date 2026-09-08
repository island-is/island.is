export const GENERIC_LIST_ID = '1NNSn5LfkQuyTNQLq3kfif'

export const CATEGORY_TAG_IDS = {
  men: '72RDPsmWuaymMrj3isul6l',
  animals: '4oiqxYyF0anptv0A4Ai8lS',
  other: '3CfXXoTTF3RLHhRyJhfy0I',
} as const

export const LINK_URL_CONTENT_TYPE = 'linkUrl' as const

export const FILE_CONTENT_TYPE_MAP: Record<string, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  pdf: 'application/pdf',
  csv: 'text/csv',
}

export const FILE_TYPE_LABELS_IS: Record<string, string> = {
  xlsx: 'Excel skrá',
  xls: 'Excel skrá',
  csv: 'Excel skrá',
  docx: 'Word skrá',
  doc: 'Word skrá',
  pdf: 'PDF skrá',
}

export const FILE_TYPE_LABELS_EN: Record<string, string> = {
  xlsx: 'Excel file',
  xls: 'Excel file',
  csv: 'Excel file',
  docx: 'Word file',
  doc: 'Word file',
  pdf: 'PDF file',
}
