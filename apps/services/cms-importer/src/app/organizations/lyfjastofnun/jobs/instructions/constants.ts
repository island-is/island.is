export const GENERIC_LIST_ID = 'iGTVkWXPzgLY9DptolKNZ'

export const CATEGORY_TAG_IDS = {
  pricingAndReimbursement: '3Yudr5pApPwJa2ezRJLy2R', // Verð og greiðsluþátttaka lyfja
  medicalDevices: '6T8zLEZkHjqdLqH6kOSk5P', // Lækningatæki
  healthInstitutions: '4zQ2teeYncyut2wuCcJmAG', // Heilbrigðisstofnanir
  pharmacies: '68WD2hWrpjGqTXYucRTDA5', // Apótek
  other: '2lpXERAljpsaEMqJVGioQ7', // Aðrar leiðbeiningar
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
