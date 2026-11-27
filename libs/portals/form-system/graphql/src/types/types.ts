import {
  FormSystemForm,
  FormSystemFieldType,
  FormSystemFormApplicant,
  FormSystemFormCertificationType,
  FormSystemListType,
  FormSystemPermissionType,
  FormSystemApplication,
  FormSystemOption,
  FormSystemFormResponse,
} from '@island.is/api/schema'
import { Option } from '@island.is/island-ui/core'

export type FormListItem = Pick<
  FormSystemForm,
  | 'id'
  | 'name'
  | 'slug'
  | 'modified'
  | 'status'
  | 'submissionServiceUrl'
  | 'isInaccessible'
  | 'lastModifiedBy'
  | 'derivedFrom'
>

export interface FormsQueryResponse {
  formSystemForms: Pick<FormSystemFormResponse, 'organizations'> & {
    forms?: Array<FormListItem | null> | null
  }
}

export interface FormsLoaderResponse {
  forms: FormListItem[]
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
  organizationDelegations: string[]
}

export interface FormLoaderResponse {
  form: FormSystemForm
  fieldTypes: FormSystemFieldType[]
  certificationTypes: FormSystemFormCertificationType[]
  applicantTypes: FormSystemFormApplicant[]
  listTypes: FormSystemListType[]
  submissionUrls: string[]
  organizationDelegations: string[]
}

export interface ApplicationsLoaderResponse {
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
  organizations: Option<string>[]
}

export type LoaderResponse =
  | FormsLoaderResponse
  | FormLoaderResponse
  | ApplicationsLoaderResponse
  | AdminLoaderResponse
