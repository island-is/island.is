import { gql } from '@apollo/client'
import { FormResponseFragment } from '../fragments/formResponse'

export const COPY_FORM = gql`
  mutation CopyFormSystemForm($input: FormSystemCopyFormInput!) {
    copyFormSystemForm(input: $input) {
      ...FormResponse
    }
  }
  ${FormResponseFragment}
`
