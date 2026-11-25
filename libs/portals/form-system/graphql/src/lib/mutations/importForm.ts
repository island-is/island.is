import { gql } from '@apollo/client'
import { FormResponseFragment } from '../fragments/formResponse'

export const IMPORT_FORM = gql`
  mutation ImportFormSystemForm($input: FormSystemImportFormInput!) {
    importFormSystemForm(input: $input) {
      ...FormResponse
    }
  }
  ${FormResponseFragment}
`
