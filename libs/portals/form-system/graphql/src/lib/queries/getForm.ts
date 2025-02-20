import { gql } from '@apollo/client'
import { FormResponseFragment } from '../fragments/formResponse'

export const GET_FORM = gql`
  query FormSystemGetForm($input: FormSystemGetFormInput!) {
    formSystemGetForm(input: $input) {
      ...FormResponseDto
    }
  }
  ${FormResponseFragment}
`
