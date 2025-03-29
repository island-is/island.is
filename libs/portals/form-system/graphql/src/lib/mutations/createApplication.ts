import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const CREATE_APPLICATION = gql`
  mutation CreateFormSystemApplication(
    $input: CreateFormSystemApplicationInput!
  ) {
    createFormSystemApplication(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
