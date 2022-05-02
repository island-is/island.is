import { Application, FieldBaseProps } from '@island.is/application/core'
import {
  ApplicationState,
  Municipality,
} from '@island.is/financial-aid/shared/lib'
import { UploadFile } from '@island.is/island-ui/core'
import { answersSchema } from './dataSchema'

export enum DataProviderTypes {
  NationalRegistry = 'NationalRegistryProvider',
  Veita = 'VeitaProvider',
}

export enum ApproveOptions {
  Yes = 'Yes',
  No = 'No',
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type ErrorSchema = NestedType<answersSchema>

export interface ExternalData {
  nationalRegistry: {
    data: {
      applicant: Applicant
      municipality: Municipality
    }
    date: string
  }
  veita: {
    data: CurrentApplication
    date: string
  }
}

export type NestedType<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? NestedType<T[K]>
    : string
}

export interface OverrideAnswerSchema extends answersSchema {
  incomeFiles: UploadFile[]
  taxReturnFiles: UploadFile[]
  spouseIncomeFiles: UploadFile[]
  spouseTaxReturnFiles: UploadFile[]
}

export type FAApplication = Override<
  Application,
  {
    answers: OverrideAnswerSchema
    externalData: ExternalData
  }
>

export type FAFieldBaseProps = Override<
  FieldBaseProps,
  { application: FAApplication; errors: ErrorSchema }
>

export interface Applicant {
  nationalId: string
  fullName: string
  address: Address
  spouse?: Spouse
}

export interface CurrentApplication {
  currentApplicationId?: string
}

export interface Address {
  streetName: string
  postalCode: string
  city: string
  municipalityCode: string
}

export interface Spouse {
  nationalId: string
  maritalStatus: string
  name: string
}

export interface InputTypes {
  id: string
  error?: string
}

export type UploadFileType =
  | 'otherFiles'
  | 'incomeFiles'
  | 'taxReturnFiles'
  | 'spouseIncomeFiles'
  | 'spouseTaxReturnFiles'

export enum SummaryComment {
  FORMCOMMENT = 'formComment',
  SPOUSEFORMCOMMENT = 'spouseFormComment',
}
