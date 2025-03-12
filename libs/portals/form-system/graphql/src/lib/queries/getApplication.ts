import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const GET_APPLICATION = gql`
  query FormSystemApplication($input: FormSystemApplicationInput!) {
    formSystemApplication(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
