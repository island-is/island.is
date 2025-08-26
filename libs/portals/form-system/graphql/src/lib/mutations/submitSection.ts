import { gql } from '@apollo/client'

export const SUBMIT_SECTION = gql`
  mutation SubmitFormSystemSection($input: SubmitFormSystemSectionInput!) {
    submitFormSystemSection(input: $input)
  }
`
