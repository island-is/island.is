import { UniqueIdentifier } from '@dnd-kit/core'
import {
  FormSystemSection,
  FormSystemScreen,
  FormSystemField,
  FormSystemLanguageType,
  FormSystemLanguageTypeInput,
} from '@island.is/api/schema'

export enum NavbarSelectStatus {
  OFF = 'Off',
  NORMAL = 'Normal',
  LIST_ITEM = 'ListItem',
  ON_WITHOUT_SELECT = 'OnWithoutSelect',
}

export type ItemType = 'Section' | 'Screen' | 'Field'

export interface ActiveItem {
  type: ItemType
  data?: FormSystemSection | FormSystemScreen | FormSystemField | null
}

export interface IListItem {
  guid: UniqueIdentifier
  label: FormSystemLanguageType | FormSystemLanguageTypeInput
  description: FormSystemLanguageType | FormSystemLanguageTypeInput
  displayOrder: number
  isSelected: boolean
}

export type ButtonTypes =
  | 'CHANGE_NAME'
  | 'CHANGE_FORM_NAME'
  | 'CHANGE_DESCRIPTION'
  | 'SET_MESSAGE_WITH_LINK_SETTINGS'

export type FormsLocationState = 'forms' | 'applications' | 'admin'
