import { DefaultEvents } from '@island.is/application/types'

export const YES = 'Yes'
export const NO = 'No'

export const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  done: 'done',
}

export type EstateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
  APPLICANT_DIVISION_OF_ESTATE = 'applicant_division_of_estate',
  APPLICANT_NO_ASSETS = 'applicant_no_assets',
  APPLICANT_POSTPONE_ESTATE_DIVISION = 'applicant_postpone_estate_division',
  APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS = 'applicant_division_of_estate_by_heirs',
}

export const EstateTypes = {
  divisionOfEstate: 'Opinber skipti',
  estateWithoutAssets: 'Eignalaust dánarbú',
  permitToPostponeEstateDivision: 'Búsetuleyfi',
  divisionOfEstateByHeirs: 'Einkaskipti',
}
