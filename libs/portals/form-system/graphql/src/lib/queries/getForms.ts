import { gql } from '@apollo/client'
import { FormResponseFragment } from '../fragments/formResponse'

export const GET_FORMS = gql`
  query FormSystemGetAllForms($input: FormSystemGetFormsInput!) {
    formSystemGetAllForms(input: $input) {
      ...FormResponse
    }
  }
  ${FormResponseFragment}
`
