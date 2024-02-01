/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, Dispatch, SetStateAction, FocusEvent } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'

export interface IFormBuilderContext {
  formBuilder: IFormBuilder
  formDispatch: Dispatch<any>
  lists: {
    activeItem: ActiveItem
    steps: IStep[]
    groups: IGroup[]
    inputs: IInput[]
  }
  listsDispatch: Dispatch<any>
  formUpdate: () => Promise<void>
  setIsTyping: Dispatch<SetStateAction<boolean>>
  inSettings: boolean
  setInSettings: Dispatch<SetStateAction<boolean>>
  setSelectStatus: Dispatch<SetStateAction<NavbarSelectStatus>>
  selectStatus: NavbarSelectStatus
  activeListItem?: IListItem | null
  setActiveListItem: Dispatch<SetStateAction<IListItem | null>>
  changeSelectHandler(e: unknown): void
  changeHandler(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    propertyName: string,
  ): void
  blur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void
  onFocus(e: string): void
}

export interface IInputSettings {
  $type?: string
  isLarge?: boolean
  size?: Sizes
  interval?: number
  erHlekkur?: boolean
  url?: string
  hnapptexti?: ILanguage
  tegundir?: string[]
  hamarksstaerd?: number
  erFjolval?: boolean
  fjoldi?: number
  header?: string
  hamarkslengd?: number
  lagmarkslengd?: number
  laggildi?: number
  hagildi?: number
  listi?: IListItem[]
  type?: string
  name?: ILanguage
  [key: string]: any
}

export interface IForm {
  id: number
  name: ILanguage
  created: Date
  lastChanged: Date
  organization: {
    id: number
    name: ILanguage
    kennitala: string
    scope: string
    xroadBaseUrl: string
  }
  dependencies: ITenging
  stepsList: IStep[]
  groupsList: IGroup[]
  inputsList: IInput[]
  stopProgressOnValidatingStep: boolean
  applicationsDaysToRemove: number
  invalidationDate?: Date
  isTranslated: boolean
  documentTypes: string[]
  adilar: string[]
}

export interface IStep {
  id: number
  guid: UniqueIdentifier
  displayOrder: number
  name: ILanguage
  type: string
  waitingText: ILanguage
  callRuleset: boolean
  isHidden: boolean
  isCompleted: boolean
}

export interface IGroup {
  id: number
  name: ILanguage
  guid: UniqueIdentifier
  displayOrder: number
  isHidden: boolean
  multiSet: number
  stepId: number
  stepGuid: UniqueIdentifier
  inputs?: IInput[]
}

export interface IInput {
  id: number
  name: ILanguage
  description: ILanguage
  isRequired: boolean
  displayOrder: number
  groupId: number
  groupGuid: UniqueIdentifier
  isHidden: boolean
  type: string
  guid: UniqueIdentifier
  inputFields: object
  inputSettings: IInputSettings
  isPartOfMultiSet: boolean
}

export type ILists = {
  activeItem: ActiveItem
  steps: IStep[]
  groups: IGroup[]
  inputs: IInput[]
  [key: string]: any // index signature for reducer
}

export interface ActiveItem {
  type: ItemType
  data: IStep | IGroup | IInput
}

export interface ISelectOption {
  label: string | number
  value: string | number
}

export interface ITenging {
  [key: string]: string[]
}

export interface IFormBuilder {
  form: IForm
  forms?: IForm[]
  documentTypes: ICertificate[]
  inputTypes: IInputTypes[]
  applicantTypes: IApplicantType[]
}

export interface IListItem {
  guid: UniqueIdentifier
  label: ILanguage
  description: ILanguage
  displayOrder: number
  isSelected: boolean
}

export interface ICertificate {
  type: string
  name: ILanguage
  description: ILanguage
}

export interface IApplicantType {
  type: string
  name: string
  nameSuggestions: ILanguage[]
}

export interface IInputTypes {
  type: string
  name: string
  description: string
  organizations?: [] //
  inputFields?: object
  inputMetadata?: object
  ruleset?: object
  inputSettings: object
}

export interface ILayoutContext {
  info: {
    organization: any
    applicationName: string
  }
  infoDispatch: React.Dispatch<any>
}

export interface ILicenseProvider {
  licenseProviderID: number
  kennitala: string
  name: string
  email: string
  phone: string
  enabled: boolean
  parentId?: number
  language: string
}

export interface ITranslationResponse {
  translations: ITranslation[]
  sourceLanguageCode: string
  targetLanguageCode: string
  model: string
}

export interface ITranslation {
  translatedText: string
  translatedTextStructured: [string, string][]
}
export enum NavbarSelectStatus {
  OFF = 'Off',
  NORMAL = 'Normal',
  LIST_ITEM = 'ListItem',
  ON_WITHOUT_SELECT = 'OnWithoutSelect',
}

export type ItemType = 'Step' | 'Group' | 'Input'

export type ILanguage = {
  is: string
  en: string
}

type Sizes = 'xs' | 'sm' | 'md'
