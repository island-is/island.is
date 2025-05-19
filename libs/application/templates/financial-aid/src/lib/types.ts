import {
  ApplicantChildCustodyInformation,
  Application,
  ApplicationAnswerFile,
  FieldBaseProps,
  NationalRegistryIndividual,
  NationalRegistrySpouseV3,
} from '@island.is/application/types'
import {
  DirectTaxPayment,
  Municipality,
  PersonalTaxReturn,
} from '@island.is/financial-aid/shared/lib'
import { answersSchema } from './dataSchema'

export enum ApproveOptions {
  Yes = 'Yes',
  No = 'No',
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type ErrorSchema = NestedType<answersSchema>

export interface ExternalData {
  nationalRegistry: {
    data: NationalRegistryIndividual
    date: string
    status: StatusProvider
  }
  nationalRegistrySpouse: {
    data?: NationalRegistrySpouseV3
    date: string
    status: StatusProvider
  }
  childrenCustodyInformation: {
    data: ApplicantChildCustodyInformation[]
    date: string
  }
  municipality: {
    data?: Municipality
    date: string
    status: StatusProvider
  }
  currentApplication: {
    data?: CurrentApplication
    date: string
    status: StatusProvider
  }
  taxData: {
    data: TaxData
    date: string
    status: StatusProvider
  }
  taxDataSpouse?: {
    data: TaxData
    date: string
    status: StatusProvider
  }
  sendSpouseEmail?: {
    data: {
      success: boolean
    }
    date: string
    status: StatusProvider
  }
}

export type NestedType<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? NestedType<T[K]>
    : string
}

export interface OverrideAnswerSchema extends answersSchema {
  incomeFiles: ApplicationAnswerFile[]
  taxReturnFiles: ApplicationAnswerFile[]
  spouseIncomeFiles: ApplicationAnswerFile[]
  spouseTaxReturnFiles: ApplicationAnswerFile[]
  childrenFiles: ApplicationAnswerFile[]
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

export interface TaxData {
  municipalitiesPersonalTaxReturn: {
    personalTaxReturn: PersonalTaxReturn | null
  }
  municipalitiesDirectTaxPayments: {
    directTaxPayments: DirectTaxPayment[]
    success: boolean
  }
}

export interface CurrentApplication {
  currentApplicationId: string
}

export interface InputTypes {
  id: string
  error?: string
}

export type StatusProvider = 'failure' | 'success'

export type UploadFileType =
  | 'otherFiles'
  | 'incomeFiles'
  | 'taxReturnFiles'
  | 'spouseIncomeFiles'
  | 'spouseTaxReturnFiles'

export enum SummaryComment {
  FORMCOMMENT = 'formComment',
  SPOUSEFORMCOMMENT = 'spouseFormComment',
  CHILDRENCOMMENT = 'childrenComment',
}

export enum SchoolType {
  KINDERGARDEN = 'kindergarden',
  ELEMENTARY = 'elementary',
  HIGHSCHOOL = 'highSchool',
}
