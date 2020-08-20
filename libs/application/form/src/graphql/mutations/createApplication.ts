import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
