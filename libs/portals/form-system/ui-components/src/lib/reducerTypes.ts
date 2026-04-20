import type {
  FormSystemApplication,
  FormSystemScreen,
  FormSystemValidationError,
  FormSystemSection,
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
    isPopulateError?: boolean
    data?: FormSystemScreen
  }
  errors?: string[]
  screenError?: FormSystemValidationError
  isValid?: boolean
  submitted?: boolean
}

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
