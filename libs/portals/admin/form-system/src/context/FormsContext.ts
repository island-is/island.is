import { FormSystemApplication, FormSystemForm, FormSystemPermissionType } from '@island.is/api/schema'
import { Option } from '@island.is/island-ui/core'
import { createContext, Dispatch, SetStateAction } from 'react'
import { FormsLocationState } from '../lib/utils/interfaces'

export interface IFormsContext {
  forms: FormSystemForm[]
  setForms: Dispatch<SetStateAction<FormSystemForm[]>>
  organizations: Option<string>[]
  setOrganizations: Dispatch<SetStateAction<Option<string>[]>>
  applications: FormSystemApplication[]
  setApplications: Dispatch<SetStateAction<FormSystemApplication[]>>
  isAdmin: boolean
  organizationId: string
  setOrganizationId: Dispatch<SetStateAction<string>>
  organizationNationalId: string
  setOrganizationNationalId: Dispatch<SetStateAction<string>>
  location: FormsLocationState
  setLocation: Dispatch<SetStateAction<FormsLocationState>>
  selectedCertificationTypes: string[]
  setSelectedCertificationTypes: Dispatch<SetStateAction<string[]>>
  selectedListTypes: string[]
  setSelectedListTypes: Dispatch<SetStateAction<string[]>>
  selectedFieldTypes: string[]
  setSelectedFieldTypes: Dispatch<SetStateAction<string[]>>
  certificationTypes: FormSystemPermissionType[]
  listTypes: FormSystemPermissionType[]
  fieldTypes: FormSystemPermissionType[]
}

export const FormsContext = createContext<IFormsContext>({
  forms: [],
  setForms: function (_value: SetStateAction<FormSystemForm[]>): void {
    throw new Error('setForms function not implemented')
  },
  organizations: [],
  setOrganizations: function (_value: SetStateAction<Option<string>[]>): void {
    throw new Error('setOrganizations function not implemented')
  },
  applications: [],
  setApplications: function (_value: SetStateAction<FormSystemApplication[]>): void {
    throw new Error('setApplications function not implemented')
  },
  isAdmin: false,
  organizationId: '',
  setOrganizationId: function (_value: SetStateAction<string>): void {
    throw new Error('setOrganizationId function not implemented')
  },
  organizationNationalId: '',
  setOrganizationNationalId: function (_value: SetStateAction<string>): void {
    throw new Error('setOrganizationNationalId function not implemented')
  },
  location: 'forms',
  setLocation: function (_value: SetStateAction<FormsLocationState>): void {
    throw new Error('setLocation function not implemented')
  },
  selectedCertificationTypes: [],
  setSelectedCertificationTypes: function (_value: SetStateAction<string[]>): void {
    throw new Error('setSelectedCertificationTypes function not implemented')
  },
  selectedListTypes: [],
  setSelectedListTypes: function (_value: SetStateAction<string[]>): void {
    throw new Error('setSelectedListTypes function not implemented')
  },
  selectedFieldTypes: [],
  setSelectedFieldTypes: function (_value: SetStateAction<string[]>): void {
    throw new Error('setSelectedFieldTypes function not implemented')
  },
  certificationTypes: [],
  listTypes: [],
  fieldTypes: [],
})