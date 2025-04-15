import { gql } from '@apollo/client'
import { FormResponseFragment } from '../fragments/formResponse'

export const GET_FORMS = gql`
  query FormSystemForms($input: FormSystemGetFormsInput!) {
    formSystemForms(input: $input) {
      ...FormResponse
    }
  }
  ${FormResponseFragment}
`
