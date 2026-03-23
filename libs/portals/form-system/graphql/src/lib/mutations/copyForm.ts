import { gql } from '@apollo/client'
import { FormResponseFragment } from '../fragments/formResponse'

export const COPY_FORM = gql`
  mutation CopyFormSystemForm($input: FormSystemGetFormInput!) {
    copyFormSystemForm(input: $input) {
      ...FormResponse
    }
  }
  ${FormResponseFragment}
`
