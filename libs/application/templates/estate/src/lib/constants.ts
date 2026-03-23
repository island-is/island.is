import { DefaultEvents } from '@island.is/application/types'

export enum DataProviderTypes {
  NationalRegistry = 'NationalRegistryProvider',
}

export const YES = 'Yes'
export const NO = 'No'

export const JA = 'Já'
export const NEI = 'Nei'

export const UPLOAD_ACCEPT = '.pdf, .doc, .docx, .rtf'
export const FILE_SIZE_LIMIT = 10000000 // 10MB

export enum States {
  prerequisites = 'prerequisites',
  draft = 'draft',
  payment = 'payment',
  done = 'done',
}

export enum ApiActions {
  completeApplication = 'completeApplication',
  syslumennOnEntry = 'syslumennOnEntry',
}

export type EstateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.ABORT }

export enum Roles {
  APPLICANT = 'applicant',
  APPLICANT_OFFICIAL_DIVISION = 'applicant_official_division',
  APPLICANT_NO_ASSETS = 'applicant_no_assets',
  APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE = 'applicant_permit_for_undivided_estate',
  APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS = 'applicant_division_of_estate_by_heirs',
}

export const EstateTypes = {
  officialDivision: 'Opinber skipti',
  estateWithoutAssets: 'Eignalaust dánarbú',
  permitForUndividedEstate: 'Seta í óskiptu búi',
  divisionOfEstateByHeirs: 'Einkaskipti',
}

// Relations fixed list used in "Seta í óskiptu búi".
// The District Commissioner's relation endpoint was not suitable for this list.
export const relationWithApplicant = [
  'Barn (sameiginlegt barn hjóna)',
  'Stjúpbarn (barn látins maka)',
  'Barnabarn (sameiginlegt barnabarn hjóna)',
  'Stjúpbarnabarn (barnabarn látins maka)',
  'Barnabarnabarn (sameiginlegt barnabarnabarn hjóna)',
  'Stjúpbarnabarnabarn (barnabarnabarn látins maka)',
]

export const SPOUSE = 'Maki'

// Applicant relation enum for "Seta í óskiptu búi"
export enum ApplicantRelation {
  SPOUSE = 'Maki',
  HEIR = 'Erfingi',
  REPRESENTATIVE = 'Umboðsmaður',
  EXCHANGE_MANAGER = 'Skiptastjóri',
}

// Charge item codes for estate payments
export const CHARGE_ITEM_CODES = {
  UNDIVIDED_ESTATE: 'AY147', // Leyfi til setu í óskiptu búi
  DIVISION_OF_ESTATE_BY_HEIRS: 'AY146', // Leyfi til einkaskipta á dánarbúi - skiptagjald
}

export const heirAgeValidation = 'heirAgeValidation'
export const missingHeirUndividedEstateValidation =
  'missingHeirUndividedEstateValidation'
export const missingSpouseUndividedEstateValidation =
  'missingSpouseUndividedEstateValidation'
export const multipleSpousesValidation = 'multipleSpousesValidation'
