import { gql } from '@apollo/client'
import { FormResponseFragment } from '../fragments/formResponse'

export const GET_FORM = gql`
  query FormSystemForm($input: FormSystemGetFormInput!) {
    formSystemForm(input: $input) {
      ...FormResponse
    }
  }
  ${FormResponseFragment}
`
