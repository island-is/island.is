import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const GET_APPLICATION = gql`
  query FormSystemGetApplication($input: FormSystemGetApplicationInput!) {
    formSystemGetApplication(input: $input) {
      ...ApplicationDto
    }
  }
  ${ApplicationFragment}
`
