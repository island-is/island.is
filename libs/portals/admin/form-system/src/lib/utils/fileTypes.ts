export const FILE_TYPE_MAP: Record<string, string[]> = {
  '.pdf': ['application/pdf'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.webp': ['image/webp'],
  '.doc': ['application/msword'],
  '.docx': [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  '.txt': ['text/plain'],
  '.gif': ['image/gif'],
  '.xlsx': [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  '.xls': ['application/vnd.ms-excel'],
  '.csv': ['text/csv', 'application/csv'],
  '.zip': ['application/zip', 'application/x-zip-compressed'],
  '*': ['select all'],
}

export const fileSizes = [
  {
    label: '1 mb',
    value: 1048576,
  },
  {
    label: '2 mb',
    value: 2097152,
  },
  {
    label: '3 mb',
    value: 3145728,
  },
  {
    label: '4 mb',
    value: 4194304,
  },
  {
    label: '5 mb',
    value: 5242880,
  },
  {
    label: '6 mb',
    value: 6291456,
  },
  {
    label: '7 mb',
    value: 7340032,
  },
  {
    label: '8 mb',
    value: 8388608,
  },
  {
    label: '9 mb',
    value: 9437184,
  },
  {
    label: '10 mb',
    value: 10485760,
  },
]
