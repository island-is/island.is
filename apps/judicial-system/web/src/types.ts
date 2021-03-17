import { TagVariant } from 'libs/island-ui/core/src'
import { Case, CaseState } from 'libs/judicial-system/types/src/lib/types'
import { Validation } from './utils/validate'

export enum AppealDecisionRole {
  PROSECUTOR = 'PROSECUTOR',
  ACCUSED = 'ACCUSED',
}

export interface RequiredField {
  value: string
  validations: Validation[]
}

export enum Sections {
  PROSECUTOR = 0,
  JUDGE = 1,
  // We skip 2 because that step has the ruling, i.e. the SignedVerdictPage, which has no subsections.
  EXTENSION = 3,
  JUDGE_EXTENSION = 4,
}

export enum ProsecutorSubsections {
  CREATE_DETENTION_REQUEST_STEP_ONE = 0,
  CREATE_DETENTION_REQUEST_STEP_TWO = 1,
  CREATE_DETENTION_REQUEST_STEP_THREE = 2,
  CREATE_DETENTION_REQUEST_STEP_FOUR = 3,
  PROSECUTOR_OVERVIEW = 4,
}

export enum JudgeSubsections {
  JUDGE_OVERVIEW = 0,
  HEARING_ARRANGEMENTS = 1,
  COURT_RECORD = 2,
  RULING_STEP_ONE = 3,
  RULING_STEP_TWO = 4,
  CONFIRMATION = 5,
}

export type ReactSelectOption = { label: string; value: string | number }

export enum LoginErrorCodes {
  UNAUTHORIZED = 'innskraning-ekki-notandi',
  UNAUTHENTICATED = 'innskraning-utrunnin',
  LOGIN_FAILED = 'innskraning-ogild',
}

export interface DetentionRequestTableProps {
  requestSort: (key: keyof Case) => void
  getClassNamesFor: (name: keyof Case) => directionType | undefined
  cases: Case[]
  handleClick: (c: Case) => void
  mapCaseStateToTagVariant: (
    state: CaseState,
    isCustodyEndDateInThePast?: boolean | undefined,
  ) => {
    color: TagVariant
    text: string
  }
  setRequestToRemoveIndex?: React.Dispatch<
    React.SetStateAction<number | undefined>
  >
  requestToRemoveIndex?: number
  isProsecutor?: boolean
  deleteCase?: (caseToDelete: Case) => Promise<void>
}

export type directionType = 'ascending' | 'descending'
