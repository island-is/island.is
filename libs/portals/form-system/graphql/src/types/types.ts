import {
  FormSystemForm,
  FormSystemFieldType,
  FormSystemFormApplicant,
  FormSystemFormCertificationType,
  FormSystemListType,
  FormSystemOrganizationUrl,
} from '@island.is/api/schema'
import { Option } from '@island.is/island-ui/core'

export interface FormsLoaderResponse {
  forms: FormSystemForm[]
  organizations: Option<string>[]
  isAdmin: boolean
}

export interface FormLoaderResponse {
  form: FormSystemForm
  fieldTypes: FormSystemFieldType[]
  certificationTypes: FormSystemFormCertificationType[]
  applicantTypes: FormSystemFormApplicant[]
  listTypes: FormSystemListType[]
  urls: FormSystemOrganizationUrl[]
}

export type LoaderResponse = FormsLoaderResponse | FormLoaderResponse
