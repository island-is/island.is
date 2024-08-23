import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const CREATE_APPLICATION = gql`
  mutation FormSystemGetApplication($input: FormSystemGetApplicationInput!) {
    formSystemGetApplication(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
