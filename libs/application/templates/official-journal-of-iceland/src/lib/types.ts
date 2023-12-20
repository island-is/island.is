import {
  MinistryOfJusticeCase,
  MinistryOfJusticeCaseCategoryType,
  MinistryOfJusticeCaseDepartmentType,
  MinistryOfJusticeCaseSignatureType,
  MinistryOfJusticeCaseSubCategoryType,
  MinistryOfJusticeCaseTemplateType,
} from '@island.is/api/schema'
import { Application, FieldBaseProps } from '@island.is/application/types'

export enum TemplateApiActions {
  getOptions = 'getOptions',
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2

type StatusProvider = 'success' | 'failure'

export enum BooleanValue {
  YES = 'yes',
  NO = 'no',
}

export type Answers = {
  approveExternalData?: boolean
  case: MinistryOfJusticeCase
}

export interface ExternalData {
  options: {
    data: {
      departments: MinistryOfJusticeCaseDepartmentType[]
      categories: MinistryOfJusticeCaseCategoryType[]
      subCategories: MinistryOfJusticeCaseSubCategoryType[]
      templates: MinistryOfJusticeCaseTemplateType[]
      signatureTypes: MinistryOfJusticeCaseSignatureType[]
    }
    date: string
    status: StatusProvider
  }
}

export type OJOIApplication = Override<
  Application,
  {
    answers: Answers
    externalData: ExternalData
  }
>

export type OJOIFieldBaseProps = Override<
  FieldBaseProps,
  {
    application: OJOIApplication
  }
>
