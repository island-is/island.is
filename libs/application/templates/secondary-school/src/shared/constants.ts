import { Language } from './types'

export enum ApplicationType {
  FRESHMAN = 'FRESHMAN',
  GENERAL_APPLICATION = 'GENERAL_APPLICATION',
}

export const FILE_SIZE_LIMIT = 10000000
export const FILE_TYPES_ALLOWED = '.pdf, .docx, .rtf'

export const NORDIC_LANGUAGES: Language[] = [
  { code: 'SE', name: 'Sænska' },
  { code: 'NO', name: 'Norska' },
]
