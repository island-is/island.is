import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const CREATE_APPLICATION = gql`
  mutation FormSystemCreateApplication($input: FormSystemCreateApplicationInput!) {
    formSystemCreateApplication(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
