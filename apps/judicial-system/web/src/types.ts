import { Validation } from './utils/validate'

export enum AppealDecisionRole {
  PROSECUTOR = 'PROSECUTOR',
  ACCUSED = 'ACCUSED',
}

export interface RequiredField {
  value: string
  validations: Validation[]
}
