import { Dispatch, SetStateAction, FocusEvent } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import { EFormApplicantTypes } from './enums'
import { FormAction } from '../hooks/formReducer'
import { FormHeaderAction } from '../hooks/headerInfoReducer'
import { FormSystemApplicantType, FormSystemDocumentType, FormSystemForm, FormSystemGroup, FormSystemInput, FormSystemListType, FormSystemStep } from '@island.is/api/schema'
import { Maybe } from 'graphql/jsutils/Maybe'

export type IFormBuilderContext = {
  // formBuilder: IFormBuilder
  // formDispatch: Dispatch<FormAction>
  lists: ILists
  formUpdate: () => Promise<void>
  inSettings: boolean
  setInSettings: Dispatch<SetStateAction<boolean>>
  setSelectStatus: Dispatch<SetStateAction<NavbarSelectStatus>>
  selectStatus: NavbarSelectStatus
  activeListItem?: IListItem | null
  setActiveListItem: Dispatch<SetStateAction<IListItem | null>>
  blur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void
  onFocus(e: string): void
}

export interface IInputSettings {
  $type?: string
  isLarge?: boolean
  size?: Sizes
  interval?: string
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
  erListi?: boolean
  erInnslattur?: boolean
  [key: string]: unknown
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
  documentTypes: ICertificate[]
  formApplicantTypes: IFormApplicantType[]
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
  groups: IGroup[]
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
  steps?: Maybe<FormSystemStep>[]
  groups?: Maybe<FormSystemGroup>[]
  inputs?: Maybe<FormSystemInput>[]
  [key: string]: unknown
}

export interface ActiveItem {
  type: ItemType
  data: Maybe<FormSystemStep> | Maybe<FormSystemGroup> | Maybe<FormSystemInput>
}

export interface ISelectOption {
  label: string | number
  value: string | number
}

export interface ITenging {
  [key: string]: string[]
}

export interface IFormBuilder {
  form?: Maybe<FormSystemForm>
  forms?: Maybe<IForm>[] | null
  documentTypes?: Maybe<Maybe<FormSystemDocumentType>[]>
  inputTypes?: Maybe<Maybe<FormSystemInput>[]>
  applicantTypes?: Maybe<Maybe<FormSystemApplicantType>[]>
  listTypes?: Maybe<Maybe<FormSystemListType>[]>
}

export interface IListType {
  id: number
  type: string
  name: ILanguage
  description: ILanguage
}

export interface IListItem {
  guid: UniqueIdentifier
  label: ILanguage
  description: ILanguage
  displayOrder: number
  isSelected: boolean
}

export interface ICertificate {
  id: number
  type: string
  name: ILanguage
  description: ILanguage
}

export interface IApplicantType {
  id: number
  name: ILanguage
  type: EFormApplicantTypes
  nameSuggestions: {
    applicantTypeId: number
    nameSuggestion: ILanguage
  }[]
}

export type IFormApplicantType = {
  formId: number
  applicantTypeId: number
  name: ILanguage
  type: EFormApplicantTypes
}

export interface IFormDocumentType {
  formId: number
  documentTypeId: number
}

export interface IInputType {
  type: string
  name: string
  description: string
  organizations?: []
  inputFields?: object
  inputMetadata?: object
  ruleset?: object
  inputSettings: object
}

export interface ILayoutContext {
  info: {
    organization: string
    applicationName: string
  }
  infoDispatch: React.Dispatch<FormHeaderAction>
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

export type ILanguage = {
  is: string
  en: string
}
export interface User {
  name?: string
  email?: string
  image?: string
}
type Sizes = 'xs' | 'sm' | 'md'

export type ItemType = 'Step' | 'Group' | 'Input'
