import { Dispatch, createContext } from 'react'
import { ControlAction, ControlState } from '../hooks/controlReducer'
import { Maybe } from 'graphql/jsutils/Maybe'
import {
  FormSystemApplicantType,
  FormSystemDocumentType,
  FormSystemForm,
  FormSystemInput,
  FormSystemListType,
} from '@island.is/api/schema'
import {
  ActiveItem,
  ItemType,
  NavbarSelectStatus,
} from '../lib/utils/interfaces'

export interface IControlContext {
  control: ControlState
  controlDispatch: Dispatch<ControlAction>
  applicantTypes: Maybe<Maybe<FormSystemApplicantType>[]> | undefined
  documentTypes: Maybe<Maybe<FormSystemDocumentType>[]> | undefined
  inputTypes: Maybe<Maybe<FormSystemInput>[]> | undefined
  listTypes: Maybe<Maybe<FormSystemListType>[]> | undefined
  setInSettings: Dispatch<boolean>
  inSettings: boolean
  updateActiveItem: (updatedActiveItem?: ActiveItem) => void
  focus: string
  setFocus: Dispatch<string>
  updateDnD: (type: ItemType) => void
  selectStatus: NavbarSelectStatus
  setSelectStatus: Dispatch<NavbarSelectStatus>
  formUpdate: (updatedForm?: FormSystemForm) => void
  inListBuilder: boolean
  setInListBuilder: Dispatch<boolean>
  updateSettings: (updatedForm?: FormSystemForm) => void
}

export const ControlContext = createContext<IControlContext>({
  control: {} as ControlState,
  controlDispatch: function (_value: unknown): void {
    throw new Error('Function not implemented.')
  },
  applicantTypes: [] as Maybe<Maybe<FormSystemApplicantType>[]>,
  documentTypes: [] as Maybe<Maybe<FormSystemDocumentType>[]>,
  inputTypes: [] as Maybe<Maybe<FormSystemInput>[]>,
  listTypes: [] as Maybe<Maybe<FormSystemListType>[]>,
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
  formUpdate: function (_updatedForm?: FormSystemForm): void {
    throw new Error('Function not implemented.')
  },
  inListBuilder: false,
  setInListBuilder: function (_value: boolean): void {
    throw new Error('Function not implemented.')
  },
  updateSettings: function (_updatedForm?: FormSystemForm): void {
    throw new Error('Function not implemented.')
  },
})
