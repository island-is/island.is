import {
  FormSystemForm,
  FormSystemFieldType,
  FormSystemFormApplicant,
  FormSystemFormCertificationType,
  FormSystemListType,
  FormSystemOrganizationUrl,
  FormSystemPermissionType,
  FormSystemApplication,
  FormSystemOption,
} from '@island.is/api/schema'
import { Option } from '@island.is/island-ui/core'

export interface FormsLoaderResponse {
  forms: FormSystemForm[]
  organizations: FormSystemOption[]
  isAdmin: boolean
  organizationId: string
  organizationNationalId: string
  applications: FormSystemApplication[]
  selectedCertificationTypes: string[]
  selectedListTypes: string[]
  selectedFieldTypes: string[]
  certificationTypes: FormSystemPermissionType[]
  listTypes: FormSystemPermissionType[]
  fieldTypes: FormSystemPermissionType[]
  submissionUrls: string[]
  submitUrls: FormSystemOrganizationUrl[]
  validationUrls: FormSystemOrganizationUrl[]
}

export interface FormLoaderResponse {
  form: FormSystemForm
  fieldTypes: FormSystemFieldType[]
  certificationTypes: FormSystemFormCertificationType[]
  applicantTypes: FormSystemFormApplicant[]
  listTypes: FormSystemListType[]
  submissionUrls: string[]
}

export interface ApplicationsLoaderResponse {
  applications: FormSystemApplication[]
  organizations: Option<string>[]
  isAdmin: boolean
  organizationNationalId: string
}

export interface AdminLoaderResponse {
  organizationId: string
  selectedCertificationTypes: string[]
  selectedListTypes: string[]
  selectedFieldTypes: string[]
  certficationTypes: FormSystemPermissionType[]
  listTypes: FormSystemPermissionType[]
  fieldTypes: FormSystemPermissionType[]
  submitUrls: FormSystemOrganizationUrl[]
  validationUrls: FormSystemOrganizationUrl[]
  organizations: Option<string>[]
}

export type LoaderResponse =
  | FormsLoaderResponse
  | FormLoaderResponse
  | ApplicationsLoaderResponse
  | AdminLoaderResponse
