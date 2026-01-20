import { gql } from '@apollo/client'

export const SUBMIT_APPLICATION = gql`
  mutation SubmitApplication($input: SubmitApplicationInput!, $locale: String) {
    submitApplication(input: $input, locale: $locale) {
      id
      state
      answers
      externalData
    }
  }
`
