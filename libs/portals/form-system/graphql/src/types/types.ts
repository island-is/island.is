import {
  FormSystemForm,
  FormSystemFieldType,
  FormSystemFormApplicant,
  FormSystemFormCertificationType,
  FormSystemListType,
  FormSystemOrganizationUrl,
  FormSystemPermissionType,
} from '@island.is/api/schema'
import { Option } from '@island.is/island-ui/core'

export interface FormsLoaderResponse {
  forms: FormSystemForm[]
  organizations: Option<string>[]
  isAdmin: boolean
  organizationNationalId: string
}

export interface FormLoaderResponse {
  form: FormSystemForm
  fieldTypes: FormSystemFieldType[]
  certificationTypes: FormSystemFormCertificationType[]
  applicantTypes: FormSystemFormApplicant[]
  listTypes: FormSystemListType[]
  urls: FormSystemOrganizationUrl[]
}

export interface ApplicationsLoaderResponse {
  forms: FormSystemForm[]
  organizations: Option<string>[]
  isAdmin: boolean
}

export interface AdminLoaderResponse {
  organizationId: string
  selectedCertificationTypes: string[]
  selectedListTypes: string[]
  selectedFieldTypes: string[]
  certficationTypes: FormSystemPermissionType[]
  listTypes: FormSystemPermissionType[]
  fieldTypes: FormSystemPermissionType[]
  organizations: Option<string>[]
}

export type LoaderResponse =
  | FormsLoaderResponse
  | FormLoaderResponse
  | ApplicationsLoaderResponse
  | AdminLoaderResponse
