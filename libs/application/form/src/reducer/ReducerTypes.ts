import {
  ExternalData,
  Form,
  FormLeaf,
  FormValue,
  Section,
} from '@island.is/application/schema'
import { FormScreen } from '../types'

export interface ApplicationUIState {
  activeSection: number
  activeSubSection: number
  activeScreen: number
  externalData: ExternalData
  form: Form
  formValue: FormValue
  formLeaves: FormLeaf[]
  progress: number
  screens: FormScreen[]
  sections: Section[]
}

export enum ActionTypes {
  ANSWER = 'ANSWER',
  EXPAND_REPEATER = 'EXPAND_REPEATER',
  ANSWER_AND_GO_NEXT_SCREEN = 'ANSWER_AND_GO_NEXT_SCREEN',
  PREV_SCREEN = 'PREV_SCREEN',
  RE_INITIALIZE = 'RE_INITIALIZE',
  ADD_EXTERNAL_DATA = 'ADD_EXTERNAL_DATA',
}

export interface Action {
  type: ActionTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}
