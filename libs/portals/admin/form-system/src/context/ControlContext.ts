import { Dispatch, SetStateAction, createContext } from 'react'
import { ControlAction, ControlState } from '../hooks/controlReducer'
import { Maybe } from 'graphql/jsutils/Maybe'
import {
  FormSystemFieldType,
  FormSystemForm,
  FormSystemFormApplicant,
  FormSystemFormCertificationType,
  FormSystemListType,
  FormSystemOrganizationUrl,
} from '@island.is/api/schema'
import {
  ActiveItem,
  ItemType,
  NavbarSelectStatus,
} from '../lib/utils/interfaces'
import { UpdateFormResponse } from '@island.is/form-system/shared'
import { GoogleTranslation } from '@island.is/form-system/shared'

export interface IControlContext {
  control: ControlState
  controlDispatch: Dispatch<ControlAction>
  certificationTypes:
    | Maybe<Maybe<FormSystemFormCertificationType>[]>
    | undefined
  fieldTypes: Maybe<Maybe<FormSystemFieldType>[]> | undefined
  listTypes: Maybe<Maybe<FormSystemListType>[]> | undefined
  submitUrls: Maybe<Maybe<FormSystemOrganizationUrl>[]> | undefined
  validationUrls: Maybe<Maybe<FormSystemOrganizationUrl>[]> | undefined
  setInSettings: Dispatch<boolean>
  inSettings: boolean
  updateActiveItem: (updatedActiveItem?: ActiveItem) => void
  focus: string
  setFocus: Dispatch<string>
  updateDnD: (type: ItemType) => void
  selectStatus: NavbarSelectStatus
  setSelectStatus: Dispatch<NavbarSelectStatus>
  setInListBuilder: Dispatch<SetStateAction<boolean>>
  inListBuilder: boolean
  formUpdate: (updatedForm?: FormSystemForm) => Promise<UpdateFormResponse>
  applicantTypes: Maybe<Maybe<FormSystemFormApplicant>[]> | undefined
  getTranslation: (text: string) => Promise<GoogleTranslation>
}

export const ControlContext = createContext<IControlContext>({
  control: {} as ControlState,
  controlDispatch: function (_value: unknown): void {
    throw new Error('Function not implemented.')
  },
  certificationTypes: [] as Maybe<Maybe<FormSystemFormCertificationType>[]>,
  fieldTypes: [] as Maybe<Maybe<FormSystemFieldType>[]>,
  listTypes: [] as Maybe<Maybe<FormSystemListType>[]>,
  submitUrls: [] as Maybe<Maybe<FormSystemOrganizationUrl>[]>,
  validationUrls: [] as Maybe<Maybe<FormSystemOrganizationUrl>[]>,
  setInSettings: function (_value: boolean): void {
    throw new Error('Function not implemented.')
  },
  inSettings: false,
  updateActiveItem: function (_updatedActiveItem?: ActiveItem): void {
    throw new Error('Function not implemented.')
  },
  focus: '',
  setFocus: function (_value: string): void {
    throw new Error('Function not implemented.')
  },
  updateDnD: function (_type: ItemType): void {
    throw new Error('Function not implemented.')
  },
  selectStatus: NavbarSelectStatus.OFF,
  setSelectStatus: function (_value: NavbarSelectStatus): void {
    throw new Error('Function not implemented.')
  },
  setInListBuilder: function (_value: SetStateAction<boolean>): void {
    throw new Error('Function not implemented.')
  },
  inListBuilder: false,
  formUpdate: function (): Promise<UpdateFormResponse> {
    throw new Error('Function not implemented.')
  },
  applicantTypes: [] as Maybe<Maybe<FormSystemFormApplicant>[]>,
  getTranslation: function (_text: string): Promise<GoogleTranslation> {
    throw new Error('Function not implemented.')
  },
})
