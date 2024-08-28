import { Dispatch, createContext } from 'react'
import { ControlAction, ControlState } from '../hooks/controlReducer'
import { Maybe } from 'graphql/jsutils/Maybe'
import {
  FormSystemFieldType,
  FormSystemFormCertificationType,
  FormSystemListType,
} from '@island.is/api/schema'
import {
  ActiveItem,
  ButtonTypes,
  InputButton,
  ItemType,
  NavbarSelectStatus,
} from '../lib/utils/interfaces'

// Removed formUpdate and updateSettings from the context
export interface IControlContext {
  control: ControlState
  controlDispatch: Dispatch<ControlAction>
  certificationTypes: Maybe<Maybe<FormSystemFormCertificationType>[]> | undefined
  fieldTypes: Maybe<Maybe<FormSystemFieldType>[]> | undefined
  listTypes: Maybe<Maybe<FormSystemListType>[]> | undefined
  setInSettings: Dispatch<boolean>
  inSettings: boolean
  updateActiveItem: (updatedActiveItem?: ActiveItem) => void
  focus: string
  setFocus: Dispatch<string>
  updateDnD: (type: ItemType) => void
  selectStatus: NavbarSelectStatus
  setSelectStatus: Dispatch<NavbarSelectStatus>
  inListBuilder: boolean
  setInListBuilder: Dispatch<boolean>
}

export const ControlContext = createContext<IControlContext>({
  control: {} as ControlState,
  controlDispatch: (_value: unknown): void => {
    throw new Error('Function not implemented.')
  },
  certificationTypes: [] as Maybe<Maybe<FormSystemFormCertificationType>[]>,
  fieldTypes: [] as Maybe<Maybe<FormSystemFieldType>[]>,
  listTypes: [] as Maybe<Maybe<FormSystemListType>[]>,
  setInSettings: (_value: boolean): void => {
    throw new Error('Function not implemented.')
  },
  inSettings: false,
  updateActiveItem: (_updatedActiveItem?: ActiveItem): void => {
    throw new Error('Function not implemented.')
  },
  focus: '',
  setFocus: (_value: string): void => {
    throw new Error('Function not implemented.')
  },
  updateDnD: (_type: ItemType): void => {
    throw new Error('Function not implemented.')
  },
  selectStatus: NavbarSelectStatus.OFF,
  setSelectStatus: (_value: NavbarSelectStatus): void => {
    throw new Error('Function not implemented.')
  },
  formUpdate: function (_updatedForm?: FormSystemForm): void {
    throw new Error('Function not implemented.')
  },
  inListBuilder: false,
  setInListBuilder: (_value: boolean): void => {
    throw new Error('Function not implemented.')
  },
  updateSettings: (_updatedForm?: FormSystemForm): void => {
    throw new Error('Function not implemented.')
  },
  translate: (_text: string): Promise<string> => {
    throw new Error('Function not implemented.')
  },
  updateSettings: function (_updatedForm?: FormSystemForm): void {
    throw new Error('Function not implemented.')
  },
})
