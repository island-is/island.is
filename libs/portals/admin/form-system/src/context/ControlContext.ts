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
  ButtonTypes,
  InputButton,
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
  translate: (text: string) => Promise<string>
  translationButtons: (text: string, type: ButtonTypes) => InputButton[]
}

export const ControlContext = createContext<IControlContext>({
  control: {} as ControlState,
  controlDispatch: (_value: unknown): void => {
    throw new Error('Function not implemented.')
  },
  applicantTypes: [] as Maybe<Maybe<FormSystemApplicantType>[]>,
  documentTypes: [] as Maybe<Maybe<FormSystemDocumentType>[]>,
  inputTypes: [] as Maybe<Maybe<FormSystemInput>[]>,
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
  formUpdate: (_updatedForm?: FormSystemForm): void => {
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
  translationButtons: (_text: string, _type: ButtonTypes): InputButton[] => {
    throw new Error('Function not implemented.')
  },
})
