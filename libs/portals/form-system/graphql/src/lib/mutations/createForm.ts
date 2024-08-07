import { gql } from '@apollo/client'
import { FormFragment } from '../fragments/formFragment'

export const CREATE_FORM = gql`
  mutation createForm($input: CreateFormInput!) {
    ...Form
  }
  ${FormFragment}
`
