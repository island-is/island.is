import { FormSystemApplication, FormSystemScreen, FormSystemSection } from "@island.is/api/schema"

export interface ApplicationState {
  application: FormSystemApplication
  sections: FormSystemSection[]
  screens: FormSystemScreen[]
  currentSection: {
    id?: string
    index: number
  }
  currentScreen?: {
    id?: string
    index: number
  }
}

export interface Action {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}