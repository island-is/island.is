import { gql } from '@apollo/client'

const LimitedAccessGetAllFiles = gql`
  query GetAllFiles($input: GetAllFilesInput!) {
    limitedAccessGetAllFiles(input: $input) {
      success
    }
  }
`

export default LimitedAccessGetAllFiles
