import {
  FormSystemApplication,
  FormSystemScreen,
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
    data?: FormSystemScreen
  }
  errors?: string[]
  isValid?: boolean
  showSummary?: boolean
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
