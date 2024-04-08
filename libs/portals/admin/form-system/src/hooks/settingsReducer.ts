import { FormSystemApplicantType, FormSystemDocumentType, FormSystemInput, FormSystemListType } from "@island.is/api/schema"
import { Maybe } from "graphql/jsutils/Maybe"


export type SettingsState = {
  applicantTypes: Maybe<Maybe<FormSystemApplicantType>[]> | undefined
  documentTypes: Maybe<Maybe<FormSystemDocumentType>[]> | undefined
  inputTypes: Maybe<Maybe<FormSystemInput>[]> | undefined
  listTypes: Maybe<Maybe<FormSystemListType>[]> | undefined
}

export type SettingsAction =
  | { type: 'something', payload: 'something' }

export const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {

  return state
}
