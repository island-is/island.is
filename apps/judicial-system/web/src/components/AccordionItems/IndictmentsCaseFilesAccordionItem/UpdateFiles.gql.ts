import { gql } from '@apollo/client'

export const UpdateFileMutation = gql`
  mutation UpdateFiles($input: UpdateFilesInput!) {
    updateFiles(input: $input) {
      caseFiles {
        id
      }
    }
  }
`
