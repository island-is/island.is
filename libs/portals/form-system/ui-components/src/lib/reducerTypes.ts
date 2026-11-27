import type {
  FormSystemApplication,
  FormSystemScreen,
  FormSystemValidationError,
  FormSystemSection,
  FormSystemLanguageType,
} from '@island.is/api/schema'

export interface ApplicationState {
  application: FormSystemApplication
  sections: FormSystemSection[]
  screens: FormSystemScreen[]
  currentSection: {
    index: number
    data: FormSystemSection
  }
  currentScreen?: {
    index: number
    data?: FormSystemScreen
  }
  externalListPlaceholders?: Array<{
    fieldId: string
    placeholder?: FormSystemLanguageType | null
  }>
  errors?: string[]
  screenError?: FormSystemValidationError
  isValid?: boolean
  submitted?: boolean
  pendingUploads?: number
  loadingFieldIds?: string[]
  isNavigating?: boolean
}

// False means a guarded action was rejected before dispatch.
export type ApplicationDispatch = (action: Action) => boolean | void

export interface Action {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

export interface FieldActions {
  type: 'LIST_VALUE'
  payload: {
    value: string
  }
}
