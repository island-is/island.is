import { gql } from '@apollo/client'

export const EXPORT_FORM = gql`
  query ExportFormSystemForm($input: FormSystemGetFormInput!) {
    exportFormSystemForm(input: $input)
  }
`
