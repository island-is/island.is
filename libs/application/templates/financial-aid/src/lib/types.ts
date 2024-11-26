import {
  ApplicantChildCustodyInformation,
  ApplicationAnswerFile,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import {
  DirectTaxPayment,
  Municipality,
  PersonalTaxReturn,
} from '@island.is/financial-aid/shared/lib'
import { AnswersSchema } from './dataSchema'

export enum ApproveOptions {
  Yes = 'Yes',
  No = 'No',
}

export type FinancialAidAnswers = AnswersSchema

export type ErrorSchema = NestedType<AnswersSchema>

export interface FinancialAidExternalData {
  nationalRegistry: {
    data: NationalRegistryIndividual
    date: string
    status: StatusProvider
  }
  nationalRegistrySpouse: {
    data?: NationalRegistrySpouse
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

export type ChildrenSchoolInfo = {
  nationalId: string
  school: string
  fullName: string
  livesWithApplicant?: boolean
  livesWithBothParents?: boolean
}

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
  | 'missingFiles'
  | 'missingFilesSpouse'

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

export interface TaxData {
  municipalitiesPersonalTaxReturn: {
    personalTaxReturn: PersonalTaxReturn | null
  }
  municipalitiesDirectTaxPayments: {
    directTaxPayments: DirectTaxPayment[]
    success: boolean
  }
}
