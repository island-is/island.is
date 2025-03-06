import { gql } from '@apollo/client'
import { FormResponseFragment } from '../fragments/formResponse'

export const CREATE_FORM = gql`
  mutation CreateFormSystemForm {
    createFormSystemForm {
      ...FormResponse
    }
  }
  ${FormResponseFragment}
`
