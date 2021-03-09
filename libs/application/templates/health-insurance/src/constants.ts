export const YES = 'yes'
export const NO = 'no'

export const FILE_SIZE_LIMIT = 10000000

export const EU = 'EU'
export const EFTA = 'EFTA'

export enum StatusTypes {
  PENSIONER = 'pensioner',
  STUDENT = 'student',
  OTHER = 'other',
  EMPLOYED = 'employed',
}

export enum NordicCountries {
  NORWAY = 'Norway',
  DENMARK = 'Denmark',
  SWEDEN = 'Sweden',
  FINLAND = 'Finland',
  FAROE_ISLANDS = 'Faroe Islands',
  GREENLAND = 'Greenland',
  ALAND = 'Åland Islands',
  SVALBARD = 'Svalbard and Jan Mayen', // because this is in the list of countries we get from api
}
