import { FormSystemForm, FormSystemFieldType, FormSystemFormApplicant, FormSystemFormCertificationType, FormSystemListType, FormSystemOrganizationUrl } from '@island.is/api/schema'

export interface FormsLoaderResponse {
  forms: FormSystemForm[]
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