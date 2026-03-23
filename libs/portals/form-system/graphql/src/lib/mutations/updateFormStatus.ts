import { gql } from '@apollo/client'
import { FormResponseFragment } from '../fragments/formResponse'

export const UPDATE_FORM_STATUS = gql`
  mutation UpdateFormSystemFormStatus(
    $input: FormSystemUpdateFormStatusInput!
  ) {
    updateFormSystemFormStatus(input: $input) {
      ...FormResponse
    }
  }
  ${FormResponseFragment}
`
